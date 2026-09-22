import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { EventCard } from '../components/EventCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Search, Filter, X, Gamepad2, Calendar, MapPin } from 'lucide-react';

export const BrowseEventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await eventService.getCategories();
        if (res.success) setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchFilteredEvents = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          size: 9,
        };
        if (searchQuery) params.query = searchQuery;
        if (selectedCategory) params.categoryId = selectedCategory;
        if (selectedType) params.eventType = selectedType;

        const res = await eventService.getEvents(params);
        if (res.success) {
          setEvents(res.data?.content || res.data || []);
          setTotalPages(res.data?.totalPages || 1);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredEvents();
  }, [searchQuery, selectedCategory, selectedType, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedType('');
    setPage(0);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Discover Gaming & Esports Events
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Find upcoming tournaments, LAN battles, and gaming conventions.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#121824] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
        
        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by event title, game (Valorant, Apex, CS2), or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-12 pr-28 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 cyber-btn-primary py-2 px-4 text-xs uppercase font-bold"
          >
            Search
          </button>
        </form>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filter By:</span>
          </div>

          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(0); }}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Event Type Filter */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            {['', 'OFFLINE', 'ONLINE', 'HYBRID'].map((type) => (
              <button
                key={type}
                onClick={() => { setSelectedType(type); setPage(0); }}
                className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                  selectedType === type
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type === '' ? 'All Types' : type}
              </button>
            ))}
          </div>

          {/* Clear Filters */}
          {(searchQuery || selectedCategory || selectedType) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 ml-auto transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

      </div>

      {/* Events Grid */}
      {loading ? (
        <LoadingSpinner size="lg" message="Fetching gaming events..." />
      ) : events.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-slate-800 text-xs font-bold rounded-lg disabled:opacity-40 border border-slate-700 hover:bg-slate-700"
              >
                Previous
              </button>
              <span className="text-xs font-semibold text-slate-400 px-4">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 bg-slate-800 text-xs font-bold rounded-lg disabled:opacity-40 border border-slate-700 hover:bg-slate-700"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#121824] border border-slate-800 rounded-2xl p-16 text-center space-y-3">
          <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Matching Events Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to see all available competitions.
          </p>
          <button
            onClick={clearFilters}
            className="cyber-btn-secondary text-xs uppercase font-bold mt-2"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
};
