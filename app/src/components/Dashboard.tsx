import React, { useEffect, useState } from "react";
import { Upload, Music2, Loader2, Plus, ChevronDown } from "lucide-react";

interface MintFormProps {
  walletAddress: string | null;
  onMintSuccess: (data: {
    releaseType: "single" | "album";
    trackName: string;
    description: string;
    supply: string;
    coverPreview: string;
    audioFileName?: string;
    albumTracks?: { trackName: string; audioFileName: string }[];
  }) => void;
}

type AlbumTrack = {
  id: string;
  trackName: string;
  audioFile: File | null;
  audioUrl: string | null;
  isLoading: boolean;
};

export default function MintForm({ walletAddress, onMintSuccess }: MintFormProps) {
  const [releaseType, setReleaseType] = useState<"single" | "album">("single");
  const [trackName, setTrackName] = useState("");
  const [description, setDescription] = useState("");
  const [supply, setSupply] = useState("");
  const [coverArt, setCoverArt] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isCoverLoading, setIsCoverLoading] = useState(false);
  const [isCustomSupply, setIsCustomSupply] = useState(false);
  const [albumTracks, setAlbumTracks] = useState<AlbumTrack[]>([
    { id: "1", trackName: "", audioFile: null, audioUrl: null, isLoading: false },
  ]);
  const [isTracksOpen, setIsTracksOpen] = useState(true);

  const presetSupplies = [1, 10, 25, 50, 100];

  useEffect(() => {
    if (audioFile) {
      const url = URL.createObjectURL(audioFile);
      setAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setAudioUrl(null);
    }
  }, [audioFile]);

  const handleCoverArtChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCoverLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setCoverArt(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result as string);
      setIsCoverLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAudioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAudioLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setAudioFile(file);
    setIsAudioLoading(false);
  };

  const handleSupplySelect = (value: number) => {
    if (supply === value.toString() && !isCustomSupply) {
      setSupply("");
    } else {
      setSupply(value.toString());
      setIsCustomSupply(false);
    }
  };

  const handleCustomSupply = () => {
    setIsCustomSupply((s) => !s);
    setSupply("");
  };

  const handleAddTrack = () => {
    const newTrack: AlbumTrack = {
      id: Date.now().toString(),
      trackName: "",
      audioFile: null,
      audioUrl: null,
      isLoading: false,
    };
    setAlbumTracks((prev) => [...prev, newTrack]);
    setIsTracksOpen(true);
  };

  const handleRemoveTrack = (id: string) => {
    if (albumTracks.length <= 1) return;
    const track = albumTracks.find((t) => t.id === id);
    if (track?.audioUrl) URL.revokeObjectURL(track.audioUrl);
    setAlbumTracks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleTrackNameChange = (id: string, name: string) => {
    setAlbumTracks((prev) => prev.map((t) => (t.id === id ? { ...t, trackName: name } : t)));
  };

  const handleTrackAudioChange = async (id: string, file: File | null) => {
    if (!file) return;
    setAlbumTracks((prev) => prev.map((t) => (t.id === id ? { ...t, isLoading: true } : t)));
    await new Promise((r) => setTimeout(r, 1200));
    const audioUrl = URL.createObjectURL(file);
    setAlbumTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, audioFile: file, audioUrl, isLoading: false } : t))
    );
  };

  const handleMint = () => {
    if (!walletAddress) {
      alert("Please connect your wallet first");
      return;
    }
    if (!coverPreview) {
      alert("Please upload cover art");
      return;
    }
    if (releaseType === "single" && !audioFile) {
      alert("Please upload audio for single release");
      return;
    }
    if (
      releaseType === "album" &&
      albumTracks.some((track) => !track.audioFile || !track.trackName.trim())
    ) {
      alert("Please ensure every track has a name and audio file");
      return;
    }

    if (releaseType === "single") {
      onMintSuccess({
        releaseType: "single",
        trackName,
        description,
        supply,
        coverPreview,
        audioFileName: audioFile?.name || "",
      });
    } else {
      onMintSuccess({
        releaseType: "album",
        trackName,
        description,
        supply,
        coverPreview,
        albumTracks: albumTracks.map((t) => ({
          trackName: t.trackName,
          audioFileName: t.audioFile?.name || "",
        })),
      });
    }
  };

  const styles = {
    roota: {
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      background: '#0b2625',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
      margin: '0',
    },
    root: {
      minHeight: '100vh',
      width: 'auto',
      background: 'transparent',
      display: 'flex',
      padding: '0',
      margin: '0',
      fontFamily: '"Poppins", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      width: '600px',
      maxWidth: '600px',
      minHeight: 'auto',
      background: 'linear-gradient(180deg, rgba(8, 28, 28, 0.40), rgba(8, 28, 28, 0.30))',
      borderRadius: '12px',
      padding: '40px',
      boxShadow: '0 6px 0 rgba(0,0,0,0.25) inset',
      border: '1px solid #15393a',
      color: '#dff7f2',
    },
    title: {
      fontSize: '18px',
      fontWeight: 600,
      color: '#2dbba7',
      margin: '2px 0 22px 0',
      textAlign: 'left' as const,
    },
    body: { display: 'grid', gap: '18px' },
    field: { display: 'block', gap: '8px' },
    label: {
      color: '#9fbdb6',
      fontSize: '12px',
      fontWeight: 600,
      marginBottom: '6px',
      display: 'block',
      textAlign: 'left' as const,
    },
    input: {
      width: '100%',
      background: '#071a1a',
      border: '1px solid #143a39',
      borderRadius: '10px',
      padding: '12px 14px',
      color: '#dff7f2',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box' as const,
    },
    textarea: {
      width: '100%',
      background: '#071a1a',
      border: '1px solid #143a39',
      borderRadius: '10px',
      padding: '12px 14px',
      color: '#dff7f2',
      fontSize: '14px',
      outline: 'none',
      minHeight: '96px',
      resize: 'none' as const,
      boxSizing: 'border-box' as const,
      fontFamily: 'inherit',
    },
    radioRow: { display: 'flex', gap: '18px', alignItems: 'center', justifyContent: 'flex-start' },
    radio: {
      display: 'inline-flex',
      gap: '10px',
      alignItems: 'center',
      padding: '6px 8px',
      borderRadius: '8px',
      cursor: 'pointer',
      color: '#9fbdb6',
      fontWeight: 600,
    },
    radioInput: {
      appearance: 'none' as const,
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      border: '2px solid #113432',
      background: 'transparent',
      position: 'relative' as const,
      cursor: 'pointer',
    },
    radioInputChecked: {
      background: 'radial-gradient(circle at center, #2fae97 0 55%, transparent 56%)',
      borderColor: '#2fae97',
    },
    radioLabel: { color: '#dff7f2', fontWeight: 500 },
    uploadCard: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '28px',
      borderRadius: '10px',
      border: '1px dashed rgba(95, 164, 151, 0.18)',
      background: '#071b1b',
      cursor: 'pointer',
      transition: 'border-color 160ms',
    },
    uploadCardProcessing: {
      borderStyle: 'solid',
      borderColor: 'rgba(47,174,151,0.16)',
      background: 'linear-gradient(180deg, rgba(10,40,40,0.48), rgba(10,40,40,0.36))',
      cursor: 'default',
    },
    uploadText: { color: '#6f9b95', fontSize: '13px', textAlign: 'center' as const },
    icon: { width: '22px', height: '22px', color: '#6f9b95' },
    coverPreview: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      background: '#051717',
      padding: '14px',
      borderRadius: '10px',
      border: '1px solid #143a39',
    },
    coverImage: { width: '88px', height: '88px', objectFit: 'cover' as const, borderRadius: '8px' },
    coverMeta: { flex: 1, display: 'flex', flexDirection: 'column' as const, gap: '4px', color: '#9fbdb6' },
    fileName: { 
      color: '#dff7f2', 
      fontWeight: 600, 
      fontSize: '13px', 
      whiteSpace: 'nowrap' as const, 
      overflow: 'hidden', 
      textOverflow: 'ellipsis', 
      maxWidth: '260px' 
    },
    fileSize: { fontSize: '12px', color: '#6f9b95' },
    coverChange: {
      fontSize: '12px',
      color: '#9fbdb6',
      borderRadius: '8px',
      padding: '6px 10px',
      background: 'transparent',
      border: '1px solid rgba(20,58,57,0.14)',
      cursor: 'pointer',
    },
    audioFileBlock: { display: 'flex', flexDirection: 'column' as const, gap: '8px' },
    audioMeta: { display: 'flex', alignItems: 'center', gap: '12px' },
    audioIconBox: {
      width: '44px',
      height: '44px',
      borderRadius: '8px',
      background: 'rgba(38,88,80,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    audioPlayer: { width: '100%', height: '34px', background: 'transparent', borderRadius: '6px' },
    audioInfo: { display: 'flex', flexDirection: 'column' as const, gap: '4px' },
    audioChange: {
      fontSize: '12px',
      color: '#9fbdb6',
      borderRadius: '8px',
      padding: '6px 10px',
      background: 'transparent',
      border: '1px solid rgba(20,58,57,0.14)',
      cursor: 'pointer',
      alignSelf: 'flex-end',
    },
    tracksHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    tracksControls: { display: 'flex', gap: '10px', alignItems: 'center' },
    muted: { color: '#6f9b95', fontSize: '13px' },
    chev: {
      background: 'transparent',
      border: 0,
      cursor: 'pointer',
      color: '#9fbdb6',
      display: 'flex',
      alignItems: 'center',
      padding: '6px',
      borderRadius: '8px',
      transition: 'transform 200ms',
    },
    chevOpen: { transform: 'rotate(180deg)' },
    tracksList: { display: 'flex', flexDirection: 'column' as const, gap: '12px', marginTop: '8px' },
    tracksListCollapsed: { display: 'none' },
    trackRow: {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      background: '#051818',
      padding: '12px',
      borderRadius: '10px',
      border: '1px solid #143a39',
    },
    trackIndex: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: 'rgba(47,174,151,0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#2fae97',
      fontWeight: 700,
    },
    trackMain: { flex: 1, display: 'flex', flexDirection: 'column' as const, gap: '8px' },
    trackActions: { display: 'flex', alignItems: 'flex-start', gap: '8px' },
    iconBtn: {
      background: 'transparent',
      border: '1px solid rgba(20,58,57,0.06)',
      padding: '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      color: '#9fbdb6',
    },
    uploadCardSmall: { padding: '10px', borderRadius: '8px' },
    audioPlayerSmall: { height: '28px' },
    btnAddTrack: {
      width: '100%',
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '10px',
      padding: '10px',
      border: '1px solid rgba(47,174,151,0.08)',
      background: 'linear-gradient(180deg, rgba(33,96,88,0.03), rgba(27,80,72,0.02))',
      color: '#2fae97',
      cursor: 'pointer',
      fontWeight: 600,
    },
    supplyGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
      marginTop: '6px',
    },
    supplyBtn: {
      padding: '10px',
      borderRadius: '10px',
      border: '1px solid #143a39',
      background: '#071a1a',
      color: '#dff7f2',
      cursor: 'pointer',
      fontWeight: 600,
    },
    supplyBtnSelected: {
      borderColor: '#2fae97',
      background: 'rgba(47,174,151,0.06)',
      color: '#2fae97',
    },
    btnMint: {
      marginTop: '4px',
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: '12px',
      borderRadius: '10px',
      border: 0,
      background: 'linear-gradient(180deg, #2fae97, #2aa78f)',
      color: '#043b36',
      fontWeight: 700,
      cursor: 'pointer',
      boxShadow: '0 4px 0 rgba(0,0,0,0.18) inset',
    },
    btnMintDisabled: {
      background: '#1f4a46',
      color: '#6b867f',
      cursor: 'not-allowed',
      opacity: 0.7,
    },
    hidden: { display: 'none' },
  };

  const isMintDisabled =
    !walletAddress ||
    !trackName ||
    !coverArt ||
    !supply ||
    (releaseType === "single" && !audioFile) ||
    (releaseType === "album" && albumTracks.some((t) => !t.audioFile || !t.trackName));

  return (
    <div style={styles.roota}>
      <div style={styles.root}>
        <div style={styles.card} role="region" aria-label="Mint your music form">
        <h2 style={styles.title}>Mint Your Music</h2>

        <div style={styles.body}>
          {/* Release Type */}
          <div style={styles.field}>
            <label style={styles.label}>Release Type</label>
            <div style={styles.radioRow} role="radiogroup" aria-label="Release type">
              <label style={styles.radio}>
                <input
                  type="radio"
                  name="releaseType"
                  value="single"
                  checked={releaseType === "single"}
                  onChange={() => setReleaseType("single")}
                  style={{
                    ...styles.radioInput,
                    ...(releaseType === "single" ? styles.radioInputChecked : {}),
                  }}
                />
                <span style={styles.radioLabel}>Single</span>
              </label>

              <label style={styles.radio}>
                <input
                  type="radio"
                  name="releaseType"
                  value="album"
                  checked={releaseType === "album"}
                  onChange={() => setReleaseType("album")}
                  style={{
                    ...styles.radioInput,
                    ...(releaseType === "album" ? styles.radioInputChecked : {}),
                  }}
                />
                <span style={styles.radioLabel}>Album</span>
              </label>
            </div>
          </div>

          {/* Track / Album Name */}
          <div style={styles.field}>
            <label htmlFor="trackName" style={styles.label}>
              {releaseType === "single" ? "Track Name" : "Album Name"}
            </label>
            <input
              id="trackName"
              type="text"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              placeholder={releaseType === "single" ? "Enter track name" : "Enter album name"}
              style={styles.input}
            />
          </div>

          {/* Cover Art */}
          <div style={styles.field}>
            <label style={styles.label}>Cover Art</label>

            {isCoverLoading ? (
              <div style={{ ...styles.uploadCard, ...styles.uploadCardProcessing }}>
                <Loader2 style={{ ...styles.icon, animation: 'spin 1s linear infinite' }} />
                <div style={styles.uploadText}>Processing image...</div>
              </div>
            ) : coverPreview ? (
              <div style={styles.coverPreview}>
                <img src={coverPreview} alt="cover preview" style={styles.coverImage} />
                <div style={styles.coverMeta}>
                  <div style={styles.fileName}>{coverArt?.name}</div>
                  <div style={styles.fileSize}>
                    {coverArt ? `${(coverArt.size / (1024 * 1024)).toFixed(2)} MB` : ""}
                  </div>
                </div>
                <label style={styles.coverChange} htmlFor="coverArt">
                  Change
                </label>
              </div>
            ) : (
              <label htmlFor="coverArt" style={styles.uploadCard} aria-hidden>
                <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <div style={styles.uploadText}>Upload cover art</div>
              </label>
            )}

            <input
              id="coverArt"
              type="file"
              accept="image/*"
              onChange={handleCoverArtChange}
              style={styles.hidden}
              disabled={isCoverLoading}
            />
          </div>

          {/* Audio - single only */}
          {releaseType === "single" && (
            <div style={styles.field}>
              <label style={styles.label}>Audio File</label>

              {isAudioLoading ? (
                <div style={{ ...styles.uploadCard, ...styles.uploadCardProcessing }}>
                  <Loader2 style={{ ...styles.icon, animation: 'spin 1s linear infinite' }} />
                  <div style={styles.uploadText}>Processing audio file...</div>
                </div>
              ) : audioFile ? (
                <div style={styles.audioFileBlock}>
                  <div style={styles.audioMeta}>
                    <div style={styles.audioIconBox}>
                      <Music2 style={styles.icon} />
                    </div>
                    <div style={styles.audioInfo}>
                      <div style={styles.fileName}>{audioFile.name}</div>
                      <div style={styles.fileSize}>{(audioFile.size / (1024 * 1024)).toFixed(2)} MB</div>
                    </div>
                  </div>
                  <label htmlFor="audioFile" style={styles.audioChange}>
                    Change
                  </label>
                  {audioUrl && <audio controls src={audioUrl} style={styles.audioPlayer} />}
                </div>
              ) : (
                <label htmlFor="audioFile" style={styles.uploadCard} aria-hidden>
                  <Music2 style={styles.icon} />
                  <div style={styles.uploadText}>Upload audio file</div>
                </label>
              )}

              <input
                id="audioFile"
                type="file"
                accept="audio/*"
                onChange={handleAudioFileChange}
                style={styles.hidden}
                disabled={isAudioLoading}
              />
            </div>
          )}

          {/* Album Tracks */}
          {releaseType === "album" && (
            <div style={styles.field}>
              <div style={styles.tracksHeader}>
                <label style={styles.label}>Album Tracks</label>
                <div style={styles.tracksControls}>
                  <span style={styles.muted}>{albumTracks.length} track{albumTracks.length !== 1 ? "s" : ""}</span>
                  <button
                    type="button"
                    style={{ ...styles.chev, ...(isTracksOpen ? styles.chevOpen : {}) }}
                    onClick={() => setIsTracksOpen((s) => !s)}
                    aria-expanded={isTracksOpen}
                    aria-controls="tracks-list"
                  >
                    <ChevronDown />
                  </button>
                </div>
              </div>

              <div
                id="tracks-list"
                style={isTracksOpen ? styles.tracksList : { ...styles.tracksList, ...styles.tracksListCollapsed }}
              >
                {albumTracks.map((track, idx) => (
                  <div key={track.id} style={styles.trackRow}>
                    <div style={styles.trackIndex}>{idx + 1}</div>
                    <div style={styles.trackMain}>
                      <input
                        type="text"
                        value={track.trackName}
                        onChange={(e) => handleTrackNameChange(track.id, e.target.value)}
                        placeholder="Track name"
                        style={styles.input}
                      />

                      {track.isLoading ? (
                        <div style={{ ...styles.uploadCard, ...styles.uploadCardProcessing, ...styles.uploadCardSmall }}>
                          <Loader2 style={{ ...styles.icon, animation: 'spin 1s linear infinite' }} />
                          <div style={styles.uploadText}>Processing...</div>
                        </div>
                      ) : track.audioFile ? (
                        <div style={styles.audioFileBlock}>
                          <div style={styles.audioMeta}>
                            <div style={styles.audioIconBox}>
                              <Music2 style={styles.icon} />
                            </div>
                            <div style={styles.audioInfo}>
                              <div style={styles.fileName}>{track.audioFile.name}</div>
                              <div style={styles.fileSize}>
                                {(track.audioFile.size / (1024 * 1024)).toFixed(2)} MB
                              </div>
                            </div>
                          </div>
                          <label htmlFor={`track-audio-${track.id}`} style={{ ...styles.audioChange, fontSize: '11px' }}>
                            Replace
                          </label>
                          {track.audioUrl && (
                            <audio controls src={track.audioUrl} style={{ ...styles.audioPlayer, ...styles.audioPlayerSmall }} />
                          )}
                        </div>
                      ) : (
                        <label
                          htmlFor={`track-audio-${track.id}`}
                          style={{ ...styles.uploadCard, ...styles.uploadCardSmall }}
                          aria-hidden
                        >
                          <Music2 style={styles.icon} />
                          <div style={styles.uploadText}>Upload audio file</div>
                        </label>
                      )}

                      <input
                        id={`track-audio-${track.id}`}
                        type="file"
                        accept="audio/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleTrackAudioChange(track.id, file);
                        }}
                        style={styles.hidden}
                        disabled={track.isLoading}
                      />
                    </div>

                    <div style={styles.trackActions}>
                      {albumTracks.length > 1 && (
                        <button
                          type="button"
                          style={styles.iconBtn}
                          onClick={() => handleRemoveTrack(track.id)}
                          aria-label={`Remove track ${idx + 1}`}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M6 6 L18 18 M6 18 L18 6" stroke="#9fbdb6" strokeWidth="1.6" strokeLinecap="round" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button type="button" onClick={handleAddTrack} style={styles.btnAddTrack}>
                  <Plus style={{ width: '18px', height: '18px' }} />
                  Add Track
                </button>
              </div>
            </div>
          )}

          {/* Description */}
          <div style={styles.field}>
            <label htmlFor="description" style={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your track..."
              rows={5}
              style={styles.textarea}
            />
          </div>

          {/* Supply */}
          <div style={styles.field}>
            <label style={styles.label}>Number of Editions</label>
            <div style={styles.supplyGrid}>
              {presetSupplies.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  style={{
                    ...styles.supplyBtn,
                    ...(supply === preset.toString() && !isCustomSupply ? styles.supplyBtnSelected : {}),
                  }}
                  onClick={() => handleSupplySelect(preset)}
                >
                  {preset}
                </button>
              ))}

              <button
                type="button"
                style={{
                  ...styles.supplyBtn,
                  ...(isCustomSupply ? styles.supplyBtnSelected : {}),
                }}
                onClick={handleCustomSupply}
              >
                Custom
              </button>
            </div>

            {isCustomSupply && (
              <input
                id="supply"
                type="number"
                value={supply}
                onChange={(e) => setSupply(e.target.value)}
                placeholder="Enter custom number"
                style={{ ...styles.input, marginTop: '10px' }}
                min={1}
                autoFocus
              />
            )}
          </div>

          {/* Mint */}
          <button
            onClick={handleMint}
            disabled={isMintDisabled}
            style={{
              ...styles.btnMint,
              ...(isMintDisabled ? styles.btnMintDisabled : {}),
            }}
            aria-disabled={isMintDisabled}
          >
            <Upload style={styles.icon} />
            <span>Mint NFT</span>
          </button>
        </div>
              </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}