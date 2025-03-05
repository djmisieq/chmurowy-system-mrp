import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Edit, Trash2, Settings } from 'lucide-react';
import { Category, getSubcategories } from '../mockCategories';

interface CategoryTreeProps {
  categories: Category[];
  onAddCategory: (parentId: number | null) => void;
  onEditCategory: (id: number) => void;
  onDeleteCategory: (id: number) => void;
  onAttributesManage: (id: number) => void;
}

interface CategoryNodeProps {
  category: Category;
  categories: Category[];
  level: number;
  expanded: boolean;
  onToggle: () => void;
  onAddCategory: (parentId: number) => void;
  onEditCategory: (id: number) => void;
  onDeleteCategory: (id: number) => void;
  onAttributesManage: (id: number) => void;
}

const CategoryNode: React.FC<CategoryNodeProps> = ({
  category,
  categories,
  level,
  expanded,
  onToggle,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onAttributesManage
}) => {
  const subcategories = getSubcategories(category.id);
  const hasChildren = subcategories.length > 0;
  
  return (
    <div className="category-node">
      <div 
        className={`flex items-center py-2 px-3 hover:bg-gray-50 ${expanded ? 'bg-gray-50' : ''}`}
        style={{ paddingLeft: `${12 + level * 20}px` }}
      >
        <div className="flex-grow flex items-center">
          <button
            onClick={onToggle}
            className={`mr-1 focus:outline-none ${!hasChildren ? 'invisible' : ''}`}
          >
            {expanded ? (
              <ChevronDown size={18} className="text-gray-400" />
            ) : (
              <ChevronRight size={18} className="text-gray-400" />
            )}
          </button>
          
          <span className="font-medium text-gray-800">{category.name}</span>
          
          <span className="ml-2 text-xs text-gray-500">({category.code})</span>
          
          {category.itemsCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {category.itemsCount} {category.itemsCount === 1 ? 'element' : 'elementów'}
            </span>
          )}
        </div>
        
        <div className="flex-shrink-0 flex space-x-2">
          <button
            onClick={() => onAddCategory(category.id)}
            title="Dodaj podkategorię"
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => onEditCategory(category.id)}
            title="Edytuj kategorię"
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onAttributesManage(category.id)}
            title="Zarządzaj atrybutami"
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={() => onDeleteCategory(category.id)}
            title="Usuń kategorię"
            className="text-red-500 hover:text-red-700 focus:outline-none"
            disabled={category.itemsCount > 0 || hasChildren}
          >
            <Trash2 size={16} className={category.itemsCount > 0 || hasChildren ? 'opacity-50 cursor-not-allowed' : ''} />
          </button>
        </div>
      </div>
      
      {expanded && hasChildren && (
        <div className="subcategories">
          {subcategories.map(subcategory => (
            <CategoryTreeNodeWithState
              key={subcategory.id}
              category={subcategory}
              categories={categories}
              level={level + 1}
              onAddCategory={onAddCategory}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
              onAttributesManage={onAttributesManage}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Wrapper z wewnętrznym stanem dla każdego węzła
const CategoryTreeNodeWithState: React.FC<Omit<CategoryNodeProps, 'expanded' | 'onToggle'>> = (props) => {
  const [expanded, setExpanded] = useState(props.level === 0); // Rozwijaj tylko główne kategorie
  
  return (
    <CategoryNode
      {...props}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    />
  );
};

const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onAttributesManage
}) => {
  // Pobierz tylko kategorie główne (bez rodzica)
  const rootCategories = getSubcategories(null);
  
  return (
    <div className="category-tree">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Struktura kategorii</h3>
        <button
          onClick={() => onAddCategory(null)}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus size={16} className="mr-1" />
          Dodaj główną kategorię
        </button>
      </div>
      
      <div className="p-4">
        {rootCategories.length > 0 ? (
          <div className="tree-container border border-gray-200 rounded-md overflow-hidden">
            {rootCategories.map(category => (
              <CategoryTreeNodeWithState
                key={category.id}
                category={category}
                categories={categories}
                level={0}
                onAddCategory={onAddCategory}
                onEditCategory={onEditCategory}
                onDeleteCategory={onDeleteCategory}
                onAttributesManage={onAttributesManage}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Brak kategorii</h3>
            <p className="mt-1 text-sm text-gray-500">
              Nie masz jeszcze żadnych zdefiniowanych kategorii.
            </p>
            <div className="mt-6">
              <button
                onClick={() => onAddCategory(null)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus size={16} className="-ml-1 mr-2" />
                Dodaj pierwszą kategorię
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-blue-50 text-blue-700 text-sm">
        <p>
          <strong>Wskazówka:</strong> Kategorie, które zawierają elementy lub podkategorie, nie mogą być usunięte. 
          Usuń najpierw wszystkie elementy z kategorii lub przenieś je do innej kategorii.
        </p>
      </div>
    </div>
  );
};

export default CategoryTree;