import React, { useState, useRef } from 'react';
import { useContent, ContentItem } from '@/contexts/ContentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  GripVertical, 
  Upload,
  X,
  Check,
  Plus
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

import Navigation from '@/components/Navigation';

const AdminCMS = () => {
  const { 
    contentItems, 
    updateContentItem, 
    deleteContentItem, 
    reorderContent, 
    getStats 
  } = useContent();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = getStats();

  const categories = [
    'Studio Sessions',
    'Live & Unfiltered', 
    'Exclusives',
    'Archive'
  ];

  const filteredItems = contentItems
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.contentType === filterCategory;
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'published' && item.isPublished) ||
        (filterStatus === 'draft' && !item.isPublished);
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleEdit = (item: ContentItem) => {
    setEditingItem({ ...item });
  };

  const handleSave = () => {
    if (!editingItem) return;
    
    updateContentItem(editingItem.id, editingItem);
    setEditingItem(null);
    
    toast({
      title: "Content Updated",
      description: `${editingItem.title} has been saved successfully.`,
    });
  };

  const handlePublishToggle = (item: ContentItem) => {
    const newStatus = !item.isPublished;
    updateContentItem(item.id, { isPublished: newStatus });
    
    toast({
      title: newStatus ? "Content Published" : "Content Unpublished",
      description: `${item.title} is now ${newStatus ? 'live' : 'hidden'}.`,
    });
  };

  const handleDelete = (item: ContentItem) => {
    deleteContentItem(item.id);
    toast({
      title: "Content Deleted",
      description: `${item.title} has been removed.`,
      variant: "destructive"
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editingItem) {
      // In a real app, this would upload to a storage service
      const fakeUrl = URL.createObjectURL(file);
      setEditingItem({
        ...editingItem,
        posterImage: fakeUrl
      });
      
      toast({
        title: "Image Updated",
        description: "Thumbnail has been updated (preview only).",
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderContent(draggedIndex, dropIndex);
      toast({
        title: "Content Reordered",
        description: "Content order has been updated.",
      });
    }
    setDraggedIndex(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Header with offset for Navigation */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-[72px] z-40 mt-[72px]">{/* Offset for main navigation */}
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Content Management</h1>
            <Button 
              onClick={() => setEditingItem({
                id: `new-${Date.now()}`,
                title: '',
                series: '',
                contentType: 'Studio Sessions',
                durationSec: 0,
                releaseDate: new Date().toISOString().split('T')[0],
                posterImage: '',
                backdropImage: '',
                isPremium: false,
                isPublished: false,
                description: '',
                year: new Date().getFullYear(),
                videoUrl: '',
                order: contentItems.length
              })}
              className="bg-blue-600 hover:bg-blue-500 text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Content
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-gray-400 text-sm font-medium">Total Items</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400">{stats.published}</div>
              <div className="text-gray-400 text-sm font-medium">Published</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-orange-400">{stats.drafts}</div>
              <div className="text-gray-400 text-sm font-medium">Drafts</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-400">{stats.innerCircle}</div>
              <div className="text-gray-400 text-sm font-medium">Inner Circle</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-200px)]">
        {/* Left Panel - Filters */}
        <div className="w-80 bg-gray-900/30 border-r border-gray-800 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Category</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Center Panel - Content List */}
        <div className="flex-1 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-transparent">
                <TableHead className="text-gray-300 w-8"></TableHead>
                <TableHead className="text-gray-300">Title</TableHead>
                <TableHead className="text-gray-300">Category</TableHead>
                <TableHead className="text-gray-300">Tier</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Year</TableHead>
                <TableHead className="text-gray-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item, index) => (
                <TableRow 
                  key={item.id} 
                  className="border-gray-800 hover:bg-gray-900/30 cursor-move"
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <TableCell>
                    <GripVertical className="w-4 h-4 text-gray-500" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.posterImage} 
                        alt={item.title}
                        className="w-12 h-8 object-cover rounded-md"
                      />
                      <div>
                        <div className="text-white font-medium">{item.title}</div>
                        <div className="text-gray-400 text-sm">{formatDuration(item.durationSec)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-gray-300 border-gray-600">
                      {item.contentType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={item.isPremium ? "default" : "secondary"}
                      className={item.isPremium ? "bg-blue-600 text-white" : "bg-gray-600 text-white"}
                    >
                      {item.isPremium ? "Inner Circle" : "Access"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={item.isPublished ? "default" : "secondary"}
                      className={item.isPublished ? "bg-green-600 text-white" : "bg-orange-600 text-white"}
                    >
                      {item.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{item.year}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(item)}
                        className="text-gray-400 hover:text-white hover:bg-gray-800"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePublishToggle(item)}
                        className="text-gray-400 hover:text-white hover:bg-gray-800"
                      >
                        {item.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(item)}
                        className="text-gray-400 hover:text-red-400 hover:bg-gray-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Right Panel - Edit Form & Preview */}
        {editingItem && (
          <div className="w-96 bg-gray-900/30 border-l border-gray-800 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                {editingItem.id.startsWith('new-') ? 'Add Content' : 'Edit Content'}
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Form Fields */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Title</label>
                <Input
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Description</label>
                <Textarea
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="bg-gray-800/50 border-gray-700 text-white min-h-[80px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Category</label>
                <Select 
                  value={editingItem.contentType} 
                  onValueChange={(value) => setEditingItem({ ...editingItem, contentType: value })}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Year</label>
                  <Input
                    type="number"
                    value={editingItem.year || new Date().getFullYear()}
                    onChange={(e) => setEditingItem({ ...editingItem, year: parseInt(e.target.value) })}
                    className="bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Duration (min)</label>
                  <Input
                    type="number"
                    value={Math.floor(editingItem.durationSec / 60)}
                    onChange={(e) => setEditingItem({ ...editingItem, durationSec: parseInt(e.target.value) * 60 })}
                    className="bg-gray-800/50 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Video URL</label>
                <Input
                  value={editingItem.videoUrl || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, videoUrl: e.target.value })}
                  placeholder="https://..."
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Thumbnail</label>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Thumbnail
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {editingItem.posterImage && (
                    <img 
                      src={editingItem.posterImage} 
                      alt="Thumbnail preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">Inner Circle</label>
                  <p className="text-xs text-gray-500">Premium tier content</p>
                </div>
                <Switch
                  checked={editingItem.isPremium}
                  onCheckedChange={(checked) => setEditingItem({ ...editingItem, isPremium: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-300">Published</label>
                  <p className="text-xs text-gray-500">Visible to users</p>
                </div>
                <Switch
                  checked={editingItem.isPublished || false}
                  onCheckedChange={(checked) => setEditingItem({ ...editingItem, isPublished: checked })}
                />
              </div>

              {/* Save Button */}
              <Button 
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white border-0"
              >
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </Button>

              {/* Live Preview */}
              <div className="mt-8">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Live Preview</h4>
                <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
                  {editingItem.posterImage && (
                    <img 
                      src={editingItem.posterImage} 
                      alt={editingItem.title}
                      className="w-full h-24 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h5 className="text-white font-semibold text-sm mb-1">{editingItem.title || 'Untitled'}</h5>
                  <p className="text-gray-400 text-xs mb-2 line-clamp-2">{editingItem.description || 'No description'}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{editingItem.contentType}</span>
                    <span className="text-gray-500">{formatDuration(editingItem.durationSec)}</span>
                  </div>
                  {editingItem.isPremium && (
                    <Badge className="mt-2 bg-blue-600 text-white text-xs">Inner Circle</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCMS;