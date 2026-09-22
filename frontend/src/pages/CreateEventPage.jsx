import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { useNotification } from '../context/NotificationContext';
import { 
  Calendar, 
  Gamepad2, 
  MapPin, 
  Globe, 
  Users, 
  Image, 
  PlusCircle, 
  Clock,
  ArrowLeft
} from 'lucide-react';

export const CreateEventPage = () => {
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    gameName: '',
    categoryId: '',
    eventType: 'OFFLINE',
    eventDate: '',
    startTime: '10:00',
    endTime: '18:00',
    location: '',
    onlineEventLink: '',
    maximumCapacity: 100,
    eventBannerUrl: '',
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await eventService.getCategories();
        if (res.success && res.data?.length > 0) {
          setCategories(res.data);
          setFormData((prev) => ({ ...prev, categoryId: res.data[0].id }));
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.eventName || !formData.gameName || !formData.categoryId || !formData.eventDate) {
      error('Please complete all mandatory event fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        eventName: formData.eventName,
        description: formData.description,
        gameName: formData.gameName,
        categoryId: Number(formData.categoryId),
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        startTime: `${formData.startTime}:00`,
        endTime: formData.endTime ? `${formData.endTime}:00` : null,
        location: formData.eventType !== 'ONLINE' ? formData.location : null,
        onlineEventLink: formData.eventType !== 'OFFLINE' ? formData.onlineEventLink : null,
        maximumCapacity: Number(formData.maximumCapacity),
        eventBannerUrl: formData.eventBannerUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
      };

      const res = await eventService.createEvent(payload);
      if (res.success) {
        success('Event created as DRAFT! You can now configure tournaments or submit for review.');
        navigate('/organizer/events');
      }
    } catch (err) {
      error(err.message || 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/organizer/events')}
          className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Host New Gaming Event</h1>
          <p className="text-xs text-slate-400">Fill in event specifications and save as draft</p>
        </div>
      </div>

      {/* Creation Form */}
      <form onSubmit={handleSubmit} className="bg-[#121824] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Gamepad2 className="w-4 h-4" />
            <span>General Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Event Title *
              </label>
              <input
                type="text"
                name="eventName"
                required
                value={formData.eventName}
                onChange={handleChange}
                placeholder="e.g. Valorant Regional Masters 2026"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Featured Game Title *
              </label>
              <input
                type="text"
                name="gameName"
                required
                value={formData.gameName}
                onChange={handleChange}
                placeholder="e.g. Valorant, Apex Legends, League of Legends"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Gaming Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Event Description
              </label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide event overview, spectator guidelines, schedule highlights..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Format, Date & Location */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Format, Schedule & Location</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Event Type
              </label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="OFFLINE">Offline (In-Person Venue)</option>
                <option value="ONLINE">Online (Virtual Tournament)</option>
                <option value="HYBRID">Hybrid (LAN + Online Stream)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Event Date *
              </label>
              <input
                type="date"
                name="eventDate"
                required
                value={formData.eventDate}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Start & End Time
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-2 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-2 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {formData.eventType !== 'ONLINE' && (
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Venue Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Metro Convention Center, Hall B, Seattle WA"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            )}

            {formData.eventType !== 'OFFLINE' && (
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Online Stream / Discord Link
                </label>
                <input
                  type="url"
                  name="onlineEventLink"
                  value={formData.onlineEventLink}
                  onChange={handleChange}
                  placeholder="https://twitch.tv/my_tournament or https://discord.gg/scrims"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Max Attendee Capacity *
              </label>
              <input
                type="number"
                name="maximumCapacity"
                min="1"
                required
                value={formData.maximumCapacity}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

          </div>
        </div>

        {/* Banner Media */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Image className="w-4 h-4" />
            <span>Event Banner</span>
          </h3>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Banner Image URL
            </label>
            <input
              type="url"
              name="eventBannerUrl"
              value={formData.eventBannerUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Form Submission */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800">
          <button
            type="button"
            onClick={() => navigate('/organizer/events')}
            className="cyber-btn-secondary text-xs font-bold uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="cyber-btn-primary text-xs font-bold uppercase tracking-wider flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Create Draft Event'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
