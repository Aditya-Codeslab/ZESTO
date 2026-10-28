import React, { useState } from 'react';
import { Restaurant, Category, MenuItem, DietaryTag } from '../../types';
import {
  createCategory,
  deleteCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability
} from '../../services/restaurantService';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Leaf,
  Flame,
  WheatOff,
  Image as ImageIcon
} from 'lucide-react';

interface MenuManagementTabProps {
  restaurant: Restaurant;
  categories: Category[];
  menuItems: MenuItem[];
  onRefreshData: () => void;
}

export const MenuManagementTab: React.FC<MenuManagementTabProps> = ({
  restaurant,
  categories,
  menuItems,
  onRefreshData
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Item form state
  const [itemName, setItemName] = useState('');
  const [itemCategoryId, setItemCategoryId] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemImageUrl, setItemImageUrl] = useState('');
  const [itemAvailable, setItemAvailable] = useState(true);
  const [itemDietary, setItemDietary] = useState<DietaryTag[]>([]);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const openAddItemModal = () => {
    setEditingItem(null);
    setItemName('');
    setItemCategoryId(categories[0]?.id || '');
    setItemPrice('');
    setItemDesc('');
    setItemImageUrl('');
    setItemAvailable(true);
    setItemDietary([]);
    setFormError('');
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (item: MenuItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemCategoryId(item.category_id);
    setItemPrice(item.price.toString());
    setItemDesc(item.description);
    setItemImageUrl(item.image_url || '');
    setItemAvailable(item.is_available);
    setItemDietary(item.dietary_tags || []);
    setFormError('');
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!itemName.trim()) {
      setFormError('Please enter a dish name');
      return;
    }
    const parsedPrice = parseFloat(itemPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError('Please enter a valid price (greater than 0)');
      return;
    }
    if (!itemCategoryId) {
      setFormError('Please select a category');
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, {
          name: itemName.trim(),
          category_id: itemCategoryId,
          price: parsedPrice,
          description: itemDesc.trim(),
          image_url: itemImageUrl.trim(),
          is_available: itemAvailable,
          dietary_tags: itemDietary
        });
      } else {
        await createMenuItem({
          restaurant_id: restaurant.id,
          category_id: itemCategoryId,
          name: itemName.trim(),
          description: itemDesc.trim(),
          price: parsedPrice,
          image_url: itemImageUrl.trim(),
          is_available: itemAvailable,
          dietary_tags: itemDietary
        });
      }
      setIsItemModalOpen(false);
      onRefreshData();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleDietary = (tag: DietaryTag) => {
    setItemDietary(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await toggleMenuItemAvailability(item.id);
      onRefreshData();
    } catch (err) {
      console.error('Failed to toggle availability', err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Delete this menu item permanently?')) {
      await deleteMenuItem(id);
      onRefreshData();
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await createCategory(restaurant.id, newCategoryName);
      setNewCategoryName('');
      setIsCategoryModalOpen(false);
      onRefreshData();
    } catch (err) {
      console.error('Failed to add category', err);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (confirm(`Delete category "${name}"? Existing items will remain in the menu.`)) {
      await deleteCategory(id);
      if (selectedCategory === id) setSelectedCategory('all');
      onRefreshData();
    }
  };

  const filteredItems = menuItems.filter(item => {
    if (selectedCategory !== 'all' && item.category_id !== selectedCategory) return false;
    if (dietaryFilter !== 'all' && !item.dietary_tags.includes(dietaryFilter as DietaryTag)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#202124]">
            Menu Catalog & Course Engineering
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Curate courses, edit pricing, assign dietary tags, and toggle daily stock availability.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#202124] bg-white border border-gray-200 hover:bg-[#F5F5F5] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#E53935]" />
            <span>New Course Category</span>
          </button>
          <button
            onClick={openAddItemModal}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-lg"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Dish</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#F5F5F5] rounded-3xl p-5 border border-gray-200 shadow-xs space-y-4">
        {/* Category Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#202124] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#202124] hover:bg-white'
            }`}
          >
            All Courses ({menuItems.length})
          </button>
          {categories.map((cat) => {
            const count = menuItems.filter(m => m.category_id === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <div key={cat.id} className="relative group/cat shrink-0 flex items-center">
                <button
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#202124] text-white shadow-xs'
                      : 'text-gray-600 hover:text-[#202124] hover:bg-white'
                  }`}
                >
                  {cat.name} ({count})
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id, cat.name)}
                  className="opacity-0 group-hover/cat:opacity-100 p-1 text-gray-400 hover:text-[#E53935] transition-opacity ml-1 cursor-pointer"
                  title="Delete category"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Search & Dietary Filters */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-gray-200">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search dishes by name or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-500 font-bold text-[11px] uppercase font-mono">Dietary:</span>
            {['all', 'vegetarian', 'spicy', 'gluten_free'].map((tag) => (
              <button
                key={tag}
                onClick={() => setDietaryFilter(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  dietaryFilter === tag
                    ? 'bg-[#202124] text-[#E53935] shadow-xs font-bold'
                    : 'text-gray-600 hover:text-[#202124] hover:bg-white'
                }`}
              >
                {tag.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dish List Table */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-[#F5F5F5] text-[11px] font-bold text-gray-500 uppercase tracking-wider font-mono">
                <th className="py-4 px-5">Dish</th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5">Tags</th>
                <th className="py-4 px-5 text-right">Price</th>
                <th className="py-4 px-5 text-center">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-500">
                    No dishes found. Click "Add Dish" to introduce new culinary creations!
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const cat = categories.find(c => c.id === item.category_id);
                  return (
                    <tr key={item.id} className="hover:bg-[#F5F5F5]/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-[#F5F5F5] border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center text-gray-500">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-editorial text-sm font-bold text-[#202124]">{item.name}</div>
                            <div className="text-[11px] text-gray-500 line-clamp-1 max-w-sm mt-0.5">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-gray-700 font-semibold">
                        {cat ? cat.name : 'Uncategorized'}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.dietary_tags.map(tag => (
                            <span key={tag} className="text-[11px] text-emerald-800 capitalize font-medium flex items-center gap-1">
                              {tag === 'vegetarian' && <Leaf className="w-3 h-3 text-emerald-700 inline" />}
                              {tag === 'spicy' && <Flame className="w-3 h-3 text-[#E53935] inline" />}
                              {tag === 'gluten_free' && <WheatOff className="w-3 h-3 text-amber-700 inline" />}
                              {tag.replace('_', ' ')}
                            </span>
                          ))}
                          {item.dietary_tags.length === 0 && (
                            <span className="text-[11px] text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right font-mono font-extrabold text-[#202124] tabular-nums">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <button
                          onClick={() => handleToggleAvailability(item)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            item.is_available
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          }`}
                        >
                          {item.is_available ? 'In Stock' : 'Sold Out'}
                        </button>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditItemModal(item)}
                            className="p-1.5 text-gray-500 hover:text-[#202124] rounded-lg hover:bg-[#F5F5F5] transition-colors cursor-pointer"
                            title="Edit dish"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 text-gray-400 hover:text-[#E53935] rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete dish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Dish Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden my-8">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-[#F5F5F5]">
              <h2 className="font-editorial text-lg font-bold text-[#202124]">
                {editingItem ? 'Edit Dish Details' : 'Add New Culinary Item'}
              </h2>
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="p-1.5 text-gray-500 hover:text-[#202124] rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Dish Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quattro Formaggi con Miele"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Course Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={itemCategoryId}
                    onChange={(e) => setItemCategoryId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] bg-white text-[#202124]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Price ($) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="0.50"
                    required
                    placeholder="18.50"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] tabular-nums font-mono text-[#202124]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description & Ingredients
                </label>
                <textarea
                  rows={2}
                  placeholder="San Marzano tomatoes, fresh mozzarella, gorgonzola, wildflower honey."
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Photo URL (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.example.com/pizza.jpg"
                  value={itemImageUrl}
                  onChange={(e) => setItemImageUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] font-mono text-[#202124]"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Leave blank to use ZESTO's stylized culinary emblem fallback.
                </span>
              </div>

              {/* Dietary Tags */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Dietary Badges
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['vegetarian', 'vegan', 'gluten_free', 'spicy'] as DietaryTag[]).map((tag) => {
                    const active = itemDietary.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleDietary(tag)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize flex items-center gap-1.5 transition-all cursor-pointer border ${
                          active
                            ? 'bg-[#202124] text-white border-[#202124]'
                            : 'bg-[#F5F5F5] text-gray-600 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {tag === 'vegetarian' && <Leaf className="w-3.5 h-3.5 text-emerald-600" />}
                        {tag === 'spicy' && <Flame className="w-3.5 h-3.5 text-[#E53935]" />}
                        {tag === 'gluten_free' && <WheatOff className="w-3.5 h-3.5 text-amber-600" />}
                        <span>{tag.replace('_', ' ')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Availability Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemAvailable}
                    onChange={(e) => setItemAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-[#E53935] focus:ring-[#E53935]/20"
                  />
                  <span className="text-xs font-semibold text-[#202124]">
                    Instantly available for dining orders on storefront
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-[#202124] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  {isSaving ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-[#F5F5F5]">
              <h2 className="font-editorial text-base font-bold text-[#202124]">Add Course Category</h2>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-[#202124] rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Handmade Pasta & Risotto"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-[#202124]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#202124] hover:bg-black rounded-xl"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
