"use client";

import { useState, useEffect } from "react";
import { AuthService } from "@/app/lib/api/services/auth.service";
import API from "@/app/lib/api/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { MenuPopup } from "@/app/components/MenuPopup";
import { Button } from "@/app/components/ui/button";
import SocketService from "@/app/lib/socket";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { Switch } from "@/app/components/ui/switch";
import { 
  Search, 
  Grid3X3, 
  List, 
  Filter, 
  SlidersHorizontal,
  Plus,
  Export,
  Eye,
  Edit,
  Trash2,
  MoreVertical
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";

interface MenuItem {
  _id: string;
  vendor: string;
  dishName: string;
  description: string;
  price: number;
  category: string;
  itemImage: string;
  visible?: boolean;
  preparationTime?: string;
  spiceLevel?: string;
  cuisineType?: string;
  stockQuantity?: number;
  dietaryInfo?: string[];
  tags?: string[];
  updatedAt?: string;
}

export default function VendorMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Category");
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const user = AuthService.getUser();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [menuItems, searchTerm, selectedCategory]);

  const fetchMenuItems = async () => {
    try {
      const menuResponse = await API.get(`/vendors/menus?vendorId=${user?.profile.id}`);
      setMenuItems(menuResponse.data.menus || []);
    } catch (error) {
      console.log("menu fetch error", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = menuItems;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.dishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All Category") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  };

  const handleToggleVisibility = async (itemId: string, currentVisibility: boolean) => {
    try {
      await API.patch(`/vendors/menus/${itemId}/visibility`, { visible: !currentVisibility });
      setMenuItems(prev =>
        prev.map(item =>
          item._id === itemId ? { ...item, visible: !currentVisibility } : item
        )
      );
      toast.success(`Menu item ${!currentVisibility ? 'shown' : 'hidden'} successfully`);
    } catch (error) {
      toast.error("Failed to update visibility");
    }
  };

  const getCategories = () => {
    const categories = Array.from(new Set(menuItems.map(item => item.category)));
    return ["All Category", ...categories];
  };

  const GridViewItem = ({ item }: { item: MenuItem }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={item.itemImage || "/hero-bg.jpg"}
          alt={item.dishName}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/vendorDashboard/menu/${item._id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/vendorDashboard/menu/${item._id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate">{item.dishName}</h3>
          <Badge variant="secondary">{item.category}</Badge>
        </div>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-xl text-green-600">₦{item.price.toLocaleString()}</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{item.visible ? "Visible" : "Hidden"}</span>
            <Switch
              checked={item.visible || false}
              onCheckedChange={() => handleToggleVisibility(item._id, item.visible || false)}
            />
          </div>
        </div>
        {item.preparationTime && (
          <p className="text-xs text-gray-500 mt-2">Prep time: {item.preparationTime}</p>
        )}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">+{item.tags.length - 3} more</Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const ListViewItem = ({ item }: { item: MenuItem }) => (
    <div className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex items-center p-4 space-x-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={item.itemImage || "/hero-bg.jpg"}
            alt={item.dishName}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{item.dishName}</h3>
          <p className="text-sm text-gray-600 truncate">{item.description}</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-bold text-lg">₦{item.price.toLocaleString()}</p>
            <Badge variant="secondary" className="text-xs">{item.category}</Badge>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium">{item.category}</p>
            <p className="text-xs text-gray-500">{item.preparationTime || "N/A"}</p>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium">
              {item.preparationTime || "All day"}
            </p>
            <p className="text-xs text-gray-500">{item.stockQuantity || 0} items</p>
          </div>

          <div className="flex flex-wrap gap-1">
            {item.tags?.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{item.visible ? "Visible" : "Hidden"}</span>
            <Switch
              checked={item.visible || false}
              onCheckedChange={() => handleToggleVisibility(item._id, item.visible || false)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/vendorDashboard/menu/${item._id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/vendorDashboard/menu/${item._id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
            <p className="text-gray-600">Manage your restaurant menu items</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center">
              <Export className="h-4 w-4 mr-2" />
              Export
            </Button>
            <MenuPopup />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Category" />
              </SelectTrigger>
              <SelectContent>
                {getCategories().map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
              className="flex items-center"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Menu Items Display */}
      <div className="bg-white rounded-lg shadow-sm">
        {viewMode === 'list' && (
          <div className="border-b border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center space-x-4 text-sm font-medium text-gray-700">
              <div className="w-16">Image</div>
              <div className="flex-1">Menu name</div>
              <div className="w-20 text-center">Price</div>
              <div className="w-24 text-center">Menu Type</div>
              <div className="w-24 text-center">Meal Times</div>
              <div className="w-20 text-center">Items</div>
              <div className="w-20 text-center">Tags</div>
              <div className="w-20 text-center">Status</div>
              <div className="w-10"></div>
            </div>
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Plus className="h-12 w-12 mx-auto mb-2 opacity-50" />
              No menu items found
            </div>
            <p className="text-gray-400 mb-6">
              {searchTerm || selectedCategory !== "All Category" 
                ? "Try adjusting your search or filters"
                : "Start by adding your first menu item"}
            </p>
            <MenuPopup />
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6"
              : "divide-y divide-gray-200"
          }>
            {filteredItems.map((item) => (
              viewMode === 'grid' 
                ? <GridViewItem key={item._id} item={item} />
                : <ListViewItem key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {filteredItems.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Showing {filteredItems.length} of {menuItems.length} menu items
            </span>
            <span>
              Page 1 of 1
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
