import React, { useState, useRef } from 'react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Upload, Music, Image, X, Check } from 'lucide-react';

const GENRES = ['Pop', 'Rock', 'Hip-Hop', 'R&B', 'Jazz', 'Classical', 'Electronic', 'Lo-Fi', 'Ambient', 'Folk', 'Country', 'Reggae', 'Metal', 'Other'];

const UploadPage = () => {
    const [form, setForm] = useState({ title: '', artist: '', album: '', genre: '', year: '', tags: '' });
    const [audioFile, setAudioFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef();
    const coverRef = useRef();

    const handleField = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleAudio = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac'].includes(file.type)) {
            toast.error('Only MP3, WAV, OGG, FLAC allowed'); return;
        }
        setAudioFile(file);
    };

    const handleCover = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { toast.error('Only image files allowed'); return; }
        setCoverFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setCoverPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.artist.trim()) { toast.error('Title and artist are required'); return; }
        if (!audioFile) { toast.error('Please select an audio file'); return; }

        setLoading(true);
        setProgress(0);

        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
        fd.append('audio', audioFile);
        if (coverFile) fd.append('coverImage', coverFile);

        try {
            setProgress(30);
            await adminAPI.uploadSong(fd);
            setProgress(100);
            toast.success('Song uploaded successfully! 🎵');
            // Reset form
            setForm({ title: '', artist: '', album: '', genre: '', year: '', tags: '' });
            setAudioFile(null);
            setCoverFile(null);
            setCoverPreview(null);
            if (audioRef.current) audioRef.current.value = '';
            if (coverRef.current) coverRef.current.value = '';
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
            setTimeout(() => setProgress(0), 1500);
        }
    };

    return (
        <div className="fade-in" style={{ padding: '28px 32px', maxWidth: 760 }}>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Upload Song</h1>
                <p style={{ color: 'var(--text-3)', fontSize: 13 }}>Add a new track to the music library</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Cover + audio drop zone */}
                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16 }}>
                    {/* Cover art */}
                    <button type="button" onClick={() => coverRef.current.click()} style={dropStyles.coverBtn}>
                        {coverPreview
                            ? <img src={coverPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
                            : <>
                                <Image size={28} color="var(--text-3)" />
                                <span style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>Cover Art</span>
                            </>
                        }
                    </button>

                    {/* Audio drop zone */}
                    <button type="button" onClick={() => audioRef.current.click()} style={{ ...dropStyles.audioBtn, borderColor: audioFile ? 'var(--green)' : 'var(--border)' }}>
                        {audioFile
                            ? <>
                                <Check size={28} color="var(--green)" />
                                <span style={{ fontWeight: 600, color: 'var(--green)', fontSize: 13, marginTop: 4 }}>{audioFile.name}</span>
                                <span style={{ color: 'var(--text-3)', fontSize: 11 }}>{(audioFile.size / 1024 / 1024).toFixed(1)} MB</span>
                            </>
                            : <>
                                <Music size={28} color="var(--text-3)" />
                                <span style={{ fontWeight: 600, color: 'var(--text-2)', fontSize: 13, marginTop: 4 }}>Click to select audio file</span>
                                <span style={{ color: 'var(--text-3)', fontSize: 11 }}>MP3, WAV, OGG, FLAC — max 50MB</span>
                            </>
                        }
                    </button>
                </div>

                <input ref={audioRef} type="file" accept="audio/*" style={{ display: 'none' }} onChange={handleAudio} />
                <input ref={coverRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCover} />

                {/* Fields grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <Field label="Title *" name="title" value={form.title} onChange={handleField} placeholder="Song title" />
                    <Field label="Artist *" name="artist" value={form.artist} onChange={handleField} placeholder="Artist name" />
                    <Field label="Album" name="album" value={form.album} onChange={handleField} placeholder="Album name" />
                    <div>
                        <label style={label}>Genre</label>
                        <select name="genre" value={form.genre} onChange={handleField} style={{ ...inp, width: '100%' }}>
                            <option value="">Select genre</option>
                            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <Field label="Year" name="year" value={form.year} onChange={handleField} placeholder="2024" type="number" />
                    <Field label="Tags" name="tags" value={form.tags} onChange={handleField} placeholder="lo-fi, study, chill (comma separated)" />
                </div>

                {/* Progress bar */}
                {loading && (
                    <div style={{ background: 'var(--card)', borderRadius: 8, height: 6, overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent))', transition: 'width 0.5s ease', borderRadius: 8 }} />
                    </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={loading} style={submitBtn}>
                    {loading
                        ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span> Uploading...</>
                        : <><Upload size={16} /> Upload to Library</>
                    }
                </button>
            </form>
        </div>
    );
};

const Field = ({ label: l, name, value, onChange, placeholder, type = 'text' }) => (
    <div>
        <label style={label}>{l}</label>
        <input name={name} value={value} onChange={onChange} placeholder={placeholder} type={type} style={{ ...inp, width: '100%' }} />
    </div>
);

const label = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6, letterSpacing: '0.3px' };
const inp = { padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: 14, height: 42 };

const dropStyles = {
    coverBtn: { width: 160, height: 160, borderRadius: 12, background: 'var(--card)', border: '2px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', padding: 0 },
    audioBtn: { flex: 1, height: 160, borderRadius: 12, background: 'var(--card)', border: '2px dashed', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 2 },
};

const submitBtn = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48,
    borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700,
    background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: '#fff',
};

export default UploadPage;
