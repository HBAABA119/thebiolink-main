'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Link {
  id: string;
  url: string;
  title: string;
  icon: string;
  position: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  position: number;
}

interface User {
  _id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  background: string;
  backgroundVideo: string;
  backgroundAudio: string;
  isEmailVerified: boolean;
}

export default function Dashboard() {
  const [user, setUser] = useState<User>({
    _id: '',
    name: '',
    username: '',
    avatar: '',
    bio: '',
    background: '',
    backgroundVideo: '',
    backgroundAudio: '',
    isEmailVerified: true,
  });
  const [links, setLinks] = useState<Link[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  // --- Effect to load user data and links on mount ---
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/dashboard/data');
        if (!res.ok) {
          if (res.status === 401) {
            console.warn("Unauthorized, redirecting to login.");
          }
          router.push('/auth/login');
          return;
        }
        const data = await res.json();
        console.log("Fetched user data:", data); // Debug log

        // --- Crucial: Populate user state including background and audio ---
        setUser({
          _id: data.user._id || '',
          name: data.user.name || '',
          username: data.user.username || '',
          avatar: data.user.avatar || '',
          bio: data.user.bio || '',
          background: data.user.background || '',
          backgroundVideo: data.user.backgroundVideo || '',
          backgroundAudio: data.user.backgroundAudio || '',
          isEmailVerified: data.user.isEmailVerified ?? true,
        });

        // --- Crucial: Populate links state ---
        const fetchedLinks = Array.isArray(data.links) ? data.links : [];
        const sortedLinks = [...fetchedLinks].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
        setLinks(
          sortedLinks.length > 0
            ? sortedLinks.map((link: any) => ({
                id: link.id || Date.now().toString() + Math.random(),
                url: link.url || '',
                title: link.title || '',
                icon: link.icon || '',
                position: link.position ?? 0,
              }))
            : []
        );
        
        // --- Populate badges state ---
        const fetchedBadges = Array.isArray(data.badges) ? data.badges : [];
        const sortedBadges = [...fetchedBadges].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
        setBadges(
          sortedBadges.length > 0
            ? sortedBadges.map((badge: any) => ({
                id: badge.id || Date.now().toString() + Math.random(),
                name: badge.name || '',
                description: badge.description || '',
                icon: badge.icon || '',
                position: badge.position ?? 0,
              }))
            : []
        );
      } catch (error) {
        console.error('Fetch error:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      router.push('/auth/login');
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, [name]: value };
      
      // If backgroundVideo is set, clear background (GIF)
      if (name === 'backgroundVideo' && value) {
        updatedUser.background = '';
      }
      
      // If background (GIF) is set, clear backgroundVideo
      if (name === 'background' && value) {
        updatedUser.backgroundVideo = '';
      }
      
      return updatedUser;
    });
  };

  const handleLinkChange = (index: number, field: keyof Link, value: string) => {
    setLinks((prevLinks) => {
      const newLinks = [...prevLinks];
      newLinks[index] = { ...newLinks[index], [field]: value };
      return newLinks;
    });
  };

  const handleBadgeChange = (index: number, field: keyof Badge, value: string) => {
    setBadges((prevBadges) => {
      const newBadges = [...prevBadges];
      newBadges[index] = { ...newBadges[index], [field]: value };
      return newBadges;
    });
  };

  const addLink = () => {
    setLinks((prevLinks) => [
      ...prevLinks,
      { id: Date.now().toString(), url: '', title: '', icon: '', position: prevLinks.length },
    ]);
  };

  const removeLink = (index: number) => {
    setLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
  };

  const addBadge = () => {
    // Limit to maximum 3 badges
    if (badges.length >= 3) {
      setMessage({ type: 'error', text: 'Maximum 3 badges allowed' });
      return;
    }
    
    setBadges((prevBadges) => [
      ...prevBadges,
      { id: Date.now().toString(), name: '', description: '', icon: '', position: prevBadges.length },
    ]);
  };

  const removeBadge = (index: number) => {
    setBadges((prevBadges) => prevBadges.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const linksToSend = links
        .filter((link) => link.url.trim() && link.title.trim())
        .map((link, index) => ({
          id: link.id,
          url: link.url.trim(),
          title: link.title.trim(),
          icon: link.icon?.trim() || '',
          position: index,
        }));

      const badgesToSend = badges
        .filter((badge) => badge.name.trim())
        .map((badge, index) => ({
          id: badge.id,
          name: badge.name.trim(),
          description: badge.description?.trim() || '',
          icon: badge.icon?.trim() || '',
          position: index,
        }));

      const response = await fetch('/api/dashboard/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            name: user.name.trim(),
            username: user.username.trim().toLowerCase(),
            avatar: user.avatar?.trim() || '',
            bio: user.bio?.trim() || '',
            background: user.background?.trim() || '',
            backgroundVideo: user.backgroundVideo?.trim() || '',
            backgroundAudio: user.backgroundAudio?.trim() || '',
          },
          links: linksToSend,
          badges: badgesToSend,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Changes saved successfully!' });
      } else {
        const errorMessage = data.error || 'Failed to save changes.';
        setMessage({ type: 'error', text: errorMessage });
      }
    } catch (error: any) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Your LinkSpark Dashboard</h1>
              <p className="text-indigo-200 mt-2">
                Customize your bio link page at{' '}
                <a
                  href={`https://linkspark-seven.vercel.app/${user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-yellow-300 hover:text-yellow-200 hover:underline"
                >
                  linkspark-seven.vercel.app/{user.username}
                </a>
              </p>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-0">
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-medium transition-all border border-white/20 backdrop-blur-sm"
              >
                Logout
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-all shadow-lg"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Profile Settings</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-200 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-2">Username</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-white/20 bg-white/10 text-indigo-200">
                      linkspark-seven.vercel.app/
                    </span>
                    <input
                      type="text"
                      name="username"
                      value={user.username}
                      onChange={handleProfileChange}
                      className="flex-1 min-w-0 px-4 py-3 bg-white/10 border border-white/20 rounded-r-xl text-white placeholder-indigo-200 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="yourname"
                    />
                  </div>
                  <p className="mt-2 text-xs text-indigo-300">
                    This will be your public link: linkspark-seven.vercel.app/{user.username}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-2">Avatar URL</label>
                  <input
                    type="url"
                    name="avatar"
                    value={user.avatar}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-200 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                {/* Background GIF Input - Disabled when video is set */}
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-2">Background GIF URL</label>
                  <input
                    type="url"
                    name="background"
                    value={user.background}
                    onChange={handleProfileChange}
                    disabled={!!user.backgroundVideo}
                    className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-200 focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${user.backgroundVideo ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="https://media.giphy.com/.../background.gif"
                  />
                  {user.backgroundVideo && (
                    <p className="mt-2 text-xs text-yellow-300">
                      Disabled when video background is set. Clear video background to enable GIF.
                    </p>
                  )}
                  <p className="mt-2 text-xs text-indigo-300">
                    Only Giphy/Tenor GIFs allowed (.gif format)
                  </p>
                </div>
                
                {/* Background Video Input - Disabled when GIF is set */}
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-2">Background Video URL</label>
                  <input
                    type="url"
                    name="backgroundVideo"
                    value={user.backgroundVideo}
                    onChange={handleProfileChange}
                    disabled={!!user.background}
                    className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-200 focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${user.background ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="https://example.com/background.mp4"
                  />
                  {user.background && (
                    <p className="mt-2 text-xs text-yellow-300">
                      Disabled when GIF background is set. Clear GIF background to enable video.
                    </p>
                  )}
                  <p className="mt-2 text-xs text-indigo-300">
                    MP4 format recommended
                  </p>
                </div>
                
                {/* Audio Upload Input */}
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-2">Background Audio</label>
                  <input
                    type="url"
                    name="backgroundAudio"
                    value={user.backgroundAudio}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-200 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="https://example.com/audio.mp3"
                  />
                  <p className="mt-2 text-xs text-indigo-300">
                    MP3 format recommended (will play automatically on your profile)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={user.bio}
                    onChange={handleProfileChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-200 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Tell people about yourself"
                  />
                </div>
              </div>
            </div>

            {/* Links Card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Link Manager</h2>
                <button
                  onClick={addLink}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg transition-all hover:scale-105"
                >
                  + Add Link
                </button>
              </div>

              <div className="space-y-4">
                {links.map((link, index) => (
                  <div key={link.id} className="border border-white/20 rounded-xl p-4 bg-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-1">Title</label>
                        <input
                          type="text"
                          value={link.title}
                          onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-200"
                          placeholder="My Website"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-1">URL</label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-200"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        value={link.icon}
                        onChange={(e) => handleLinkChange(index, 'icon', e.target.value)}
                        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-indigo-200 flex-1 mr-3"
                        placeholder="Icon URL (optional)"
                      />
                      <button
                        onClick={() => removeLink(index)}
                        className="text-red-400 hover:text-red-300 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {links.length === 0 && (
                  <div className="text-center py-8 text-indigo-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a2 2 0 00-2.828 0l-6 6a2 2 0 002.828 2.828l6-6a2 2 0 000-2.828z" />
                    </svg>
                    <p>No links added yet</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Badges Card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Badges</h2>
                <button
                  onClick={addBadge}
                  disabled={badges.length >= 3}
                  className={`px-4 py-2 rounded-lg transition-all hover:scale-105 ${badges.length >= 3 ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'}`}
                >
                  + Add Badge
                </button>
              </div>
              
              <div className="space-y-4">
                {badges.map((badge, index) => (
                  <div key={badge.id} className="border border-white/20 rounded-xl p-4 bg-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-1">Badge Name</label>
                        <input
                          type="text"
                          value={badge.name}
                          onChange={(e) => handleBadgeChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-200"
                          placeholder="Early Adopter"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-1">Icon URL</label>
                        <input
                          type="url"
                          value={badge.icon}
                          onChange={(e) => handleBadgeChange(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-200"
                          placeholder="https://example.com/icon.png"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-1">Description</label>
                      <input
                        type="text"
                        value={badge.description}
                        onChange={(e) => handleBadgeChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-200"
                        placeholder="Awarded for early adoption"
                      />
                    </div>
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => removeBadge(index)}
                        className="text-red-400 hover:text-red-300 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                
                {badges.length === 0 && (
                  <div className="text-center py-8 text-indigo-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <p>No badges added yet (maximum 3)</p>
                  </div>
                )}
                
                <p className="text-xs text-indigo-300 mt-2">
                  You can add up to 3 badges that will appear on your profile. Badges are a great way to showcase achievements or special status.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Preview Card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4 text-white">Live Preview</h2>
              <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl p-6 text-center relative overflow-hidden min-h-[500px]">
                {/* Display Background GIF */}
                {user.background && (
                  <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${user.background})`,
                    }}
                  />
                )}
                
                {/* Display Background Video */}
                {user.backgroundVideo && (
                  <video 
                    className="absolute inset-0 z-0 object-cover w-full h-full"
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                  >
                    <source src={user.backgroundVideo} type="video/mp4" />
                  </video>
                )}
                
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                <div className="relative z-20">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-white/30"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{user.name}</h3>
                  
                  {/* Badges Display */}
                  {badges.filter(b => b.name).length > 0 && (
                    <div className="flex justify-center space-x-2 mb-4">
                      {badges.filter(b => b.name).map((badge, index) => (
                        <div key={index} className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white flex items-center">
                          {badge.icon && (
                            <img src={badge.icon} alt={badge.name} className="w-4 h-4 mr-1" />
                          )}
                          {badge.name}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div>
                    {user.bio && <p className="text-indigo-200 mb-4">{user.bio}</p>}
                    <div className="space-y-3">
                      {links
                        .filter((link) => link.url && link.title)
                        .map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg text-sm transition-all"
                          >
                            {link.title}
                          </a>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sticky top-64">
              <h3 className="text-lg font-semibold mb-4 text-white">Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-indigo-200">Total Links</span>
                  <span className="text-white font-medium">{links.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-200">Badges</span>
                  <span className="text-white font-medium">{badges.filter(b => b.name).length}/3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-200">Profile Completion</span>
                  <span className="text-white font-medium">
                    {/* Simple calculation: name, username, avatar/bio, background are key fields */}
                    {(() => {
                      const completedFields = [
                        user.name,
                        user.username,
                        user.avatar || user.bio,
                        user.background || user.backgroundVideo || user.backgroundAudio,
                      ].filter(Boolean).length;
                      const totalFields = 4;
                      return `${Math.round((completedFields / totalFields) * 100)}%`;
                    })()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-200">Last Updated</span>
                  <span className="text-white font-medium">Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`fixed bottom-6 right-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-900/80 text-green-200 border border-green-800' : 'bg-red-900/80 text-red-200 border border-red-800'} max-w-sm backdrop-blur-sm`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}