import React, { useMemo, useState } from 'react';
import PaymentMethodScreen from './PaymentMethodScreen';
import { Link } from 'react-router-dom';
// ----------------------------------------------------------------------------
// Mock data — swap for your menu API. `image` accepts a remote URL; leave it
// null to fall back to the emoji tile (handy for placeholder/demo content).
// ----------------------------------------------------------------------------

const CATEGORIES = [
  { id: 'pizza', name: 'Pizza', emoji: '🍕', image: null },
  { id: 'burgers', name: 'Burgers', emoji: '🍔', image: null },
  { id: 'drinks', name: 'Drinks', emoji: '🥤', image: null },
  { id: 'desserts', name: 'Desserts', emoji: '🍰', image: null },
  { id: 'sides', name: 'Sides', emoji: '🍟', image: null },
];

const ITEMS_BY_CATEGORY = {
  pizza: [
    {
      id: 'p1',
      name: 'Garlic Margherita Pizza',
      emoji: '🍕',
      image: null,
      price: 13.75,
      modifierGroups: [
        {
          id: 'crust',
          title: 'Choice of Crust',
          type: 'single',
          required: true,
          options: [
            { id: 'thin', name: 'Thin Crust', price: 0 },
            { id: 'stuffed', name: 'Stuffed Crust', price: 2.5 },
          ],
        },
        {
          id: 'toppings',
          title: 'Extra Toppings',
          type: 'multi',
          required: false,
          maxSelect: 3,
          options: [
            { id: 'achar', name: 'Achar', price: 1.0 },
            { id: 'pineapple', name: 'Pineapple', price: 1.0 },
            { id: 'seekh', name: 'Seekh Kebab', price: 1.5 },
          ],
        },
      ],
    },
    {
      id: 'p2',
      name: 'Pepperoni Feast',
      emoji: '🍕',
      image: null,
      price: 12.5,
      modifierGroups: [
        {
          id: 'crust2',
          title: 'Choice of Crust',
          type: 'single',
          required: true,
          options: [
            { id: 'thin2', name: 'Thin Crust', price: 0 },
            { id: 'thick2', name: 'Thick Crust', price: 1.5 },
          ],
        },
      ],
    },
    { id: 'p3', name: 'Veggie Supreme', emoji: '🍕', image: null, price: 11.0, modifierGroups: [] },
  ],
  burgers: [
    {
      id: 'b1',
      name: 'TS Chicken Box',
      emoji: '🍔',
      image: null,
      price: 10.0,
      modifierGroups: [
        {
          id: 'flavor',
          title: 'Choose your Flavor',
          type: 'single',
          required: true,
          options: [
            { id: 'periperi', name: 'Peri Peri', price: 0 },
            { id: 'bbq', name: 'BBQ', price: 0 },
            { id: 'spicy', name: 'Spicy', price: 0 },
          ],
        },
      ],
    },
    {
      id: 'b2',
      name: 'Classic Beef Burger',
      emoji: '🍔',
      image: null,
      price: 9.5,
      modifierGroups: [
        {
          id: 'extras',
          title: 'Add Extras',
          type: 'multi',
          required: false,
          options: [
            { id: 'cheese', name: 'Extra Cheese', price: 1.0 },
            { id: 'bacon', name: 'Bacon', price: 1.5 },
          ],
        },
      ],
    },
    { id: 'b3', name: 'Veggie Burger', emoji: '🍔', image: null, price: 8.5, modifierGroups: [] },
  ],
  drinks: [
    { id: 'd1', name: 'Passion Punch Cooler', emoji: '🥤', image: null, price: 4.0, modifierGroups: [] },
    {
      id: 'd2',
      name: 'Cold Coffee',
      emoji: '☕',
      image: null,
      price: 3.5,
      modifierGroups: [
        {
          id: 'size',
          title: 'Size',
          type: 'single',
          required: true,
          options: [
            { id: 'reg', name: 'Regular', price: 0 },
            { id: 'lg', name: 'Large', price: 1.0 },
          ],
        },
      ],
    },
    { id: 'd3', name: 'Fresh Lemonade', emoji: '🍋', image: null, price: 3.0, modifierGroups: [] },
  ],
  desserts: [
    {
      id: 'e1',
      name: 'Strawberry & Cream Cheesecake',
      emoji: '🍰',
      image: null,
      price: 6.29,
      modifierGroups: [],
    },
    { id: 'e2', name: 'Chocolate Brownie', emoji: '🍫', image: null, price: 5.5, modifierGroups: [] },
  ],
  sides: [
    {
      id: 's1',
      name: 'Loaded Fries',
      emoji: '🍟',
      image: null,
      price: 5.0,
      modifierGroups: [
        {
          id: 'sauce',
          title: 'Choose Sauce',
          type: 'single',
          required: false,
          options: [
            { id: 'ketchup', name: 'Ketchup', price: 0 },
            { id: 'mayo', name: 'Mayo', price: 0 },
            { id: 'garlic', name: 'Garlic Sauce', price: 0.5 },
          ],
        },
      ],
    },
    { id: 's2', name: 'Onion Rings', emoji: '🧅', image: null, price: 4.5, modifierGroups: [] },
  ],
};

const ORDER_TYPE_LABELS = {
  delivery: { label: 'Delivery', color: '#1D4ED8', bg: '#DBEAFE' },
  dine_in: { label: 'Dine In', color: '#047857', bg: '#D1FAE5' },
  eat_in: { label: 'Eat In', color: '#B45309', bg: '#FEF3C7' },
  takeaway: { label: 'Takeaway', color: '#7C3AED', bg: '#EDE9FE' },
  collection: { label: 'Collection', color: '#0D9488', bg: '#CCFBF1' },
};

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

const money = (n) => `£${n.toFixed(2)}`;

function ChevronLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function resolveSelectedModifiers(item, selections) {
  const resolved = [];
  item.modifierGroups.forEach((group) => {
    if (group.type === 'single') {
      const optionId = selections[group.id];
      const option = group.options.find((o) => o.id === optionId);
      if (option) resolved.push({ groupTitle: group.title, name: option.name, price: option.price });
    } else {
      (selections[group.id] || []).forEach((optionId) => {
        const option = group.options.find((o) => o.id === optionId);
        if (option) resolved.push({ groupTitle: group.title, name: option.name, price: option.price });
      });
    }
  });
  return resolved;
}

// Small helper for the "numberOfLines" line-clamp behaviour RN gives for free.
function clampStyle(lines) {
  return {
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };
}

// ----------------------------------------------------------------------------
// Shared thumbnail — renders a real image when `uri` is provided, otherwise
// an emoji tile. Swap in your CDN image URLs by setting `image` in the data.
// ----------------------------------------------------------------------------

function Thumbnail({ uri, emoji, size = 44, radius = 12, bg = '#F3F4F6' }) {
  if (uri) {
    return (
      <img
        src={uri}
        alt=""
        style={{ width: size, height: size, borderRadius: radius, objectFit: 'cover' }}
      />
    );
  }
  return (
    <div
      style={{
        ...styles.thumbnailFallback,
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: bg,
      }}
    >
      <span style={{ fontSize: size * 0.5 }}>{emoji}</span>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Left panel — category list
// ----------------------------------------------------------------------------

function CategoryList({ categories, activeCategoryId, onSelect }) {
  return (
    <div style={styles.categoryPanel}>
      <div style={styles.categoryScroll}>
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <div
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              role="button"
              tabIndex={0}
              style={{
                ...styles.categoryRow,
                ...(isActive ? styles.categoryRowActive : null),
              }}
            >
              <Thumbnail uri={cat.image} emoji={cat.emoji} size={40} radius={10} />
              <span
                style={{
                  ...styles.categoryLabel,
                  ...(isActive ? styles.categoryLabelActive : null),
                  ...clampStyle(2),
                }}
              >
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Middle panel — item grid
// ----------------------------------------------------------------------------

function ItemCard({ item, onPress }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div
      onClick={() => onPress(item)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      role="button"
      tabIndex={0}
      style={{
        ...styles.itemCard,
        ...(pressed ? styles.itemCardPressed : null),
      }}
    >
      <Thumbnail uri={item.image} emoji={item.emoji} size={64} radius={14} bg="#F3F4F6" />
      <span style={{ ...styles.itemCardName, ...clampStyle(2) }}>{item.name}</span>
      <span style={styles.itemCardPrice}>{money(item.price)}</span>
    </div>
  );
}

function ItemsGrid({ categoryName, items, onSelectItem }) {
  return (
    <div style={styles.itemsGridScroll}>
      <div style={styles.categoryHeading}>{categoryName}</div>
      <div style={styles.itemsGrid}>
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onPress={onSelectItem} />
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Middle panel — modifier selector (replaces the item grid while active)
// ----------------------------------------------------------------------------

function QuantityStepper({ quantity, onChange }) {
  return (
    <div style={styles.qtyStepper}>
      <div
        onClick={() => onChange(Math.max(1, quantity - 1))}
        role="button"
        tabIndex={0}
        style={styles.qtyButton}
      >
        <span style={styles.qtyButtonText}>−</span>
      </div>
      <span style={styles.qtyValue}>{quantity}</span>
      <div onClick={() => onChange(quantity + 1)} role="button" tabIndex={0} style={styles.qtyButton}>
        <span style={styles.qtyButtonText}>+</span>
      </div>
    </div>
  );
}

function SingleSelectGroup({ group, selectedId, onSelect }) {
  return (
    <div style={styles.modifierGroupBlock}>
      <div style={styles.modifierGroupHeader}>
        <span style={styles.modifierGroupTitle}>{group.title}</span>
        {group.required && <span style={styles.requiredTag}>Required</span>}
      </div>
      {group.options.map((opt) => {
        const isSelected = selectedId === opt.id;
        return (
          <div
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            role="button"
            tabIndex={0}
            style={styles.optionRow}
          >
            <div style={{ ...styles.radioOuter, ...(isSelected ? styles.radioOuterActive : null) }}>
              {isSelected && <div style={styles.radioInner} />}
            </div>
            <span style={styles.optionName}>{opt.name}</span>
            <span style={styles.optionPrice}>{opt.price > 0 ? `+${money(opt.price)}` : 'Free'}</span>
          </div>
        );
      })}
    </div>
  );
}

function MultiSelectGroup({ group, selectedIds, onToggle }) {
  return (
    <div style={styles.modifierGroupBlock}>
      <div style={styles.modifierGroupHeader}>
        <span style={styles.modifierGroupTitle}>{group.title}</span>
        {group.maxSelect ? <span style={styles.requiredTag}>Up to {group.maxSelect}</span> : null}
      </div>
      {group.options.map((opt) => {
        const isSelected = selectedIds.includes(opt.id);
        return (
          <div
            key={opt.id}
            onClick={() => onToggle(opt.id)}
            role="button"
            tabIndex={0}
            style={styles.optionRow}
          >
            <div
              style={{ ...styles.checkboxOuter, ...(isSelected ? styles.checkboxOuterActive : null) }}
            >
              {isSelected && <span style={styles.checkboxTick}>✓</span>}
            </div>
            <span style={styles.optionName}>{opt.name}</span>
            <span style={styles.optionPrice}>{opt.price > 0 ? `+${money(opt.price)}` : 'Free'}</span>
          </div>
        );
      })}
    </div>
  );
}

function ItemModifierView({
  item,
  selections,
  quantity,
  onSelectSingle,
  onToggleMulti,
  onQuantityChange,
  onBack,
  onAddToCart,
  canAdd,
  unitPrice,
}) {
  return (
    <div style={styles.modifierViewContainer}>
      <div style={styles.modifierViewHeader}>
        <div onClick={onBack} role="button" tabIndex={0} style={styles.backButton}>
          <span style={styles.backButtonText}>‹</span>
        </div>
        <span style={styles.modifierViewTitle}>Customize item</span>
      </div>

      <div style={styles.modifierScroll}>
        <div style={styles.modifierItemHeader}>
          <Thumbnail uri={item.image} emoji={item.emoji} size={72} radius={16} />
          <div style={{ flex: 1, marginLeft: 14 }}>
            <div style={styles.modifierItemName}>{item.name}</div>
            <div style={styles.modifierItemBasePrice}>{money(item.price)}</div>
          </div>
        </div>

        {item.modifierGroups.map((group) =>
          group.type === 'single' ? (
            <SingleSelectGroup
              key={group.id}
              group={group}
              selectedId={selections[group.id]}
              onSelect={(optId) => onSelectSingle(group.id, optId)}
            />
          ) : (
            <MultiSelectGroup
              key={group.id}
              group={group}
              selectedIds={selections[group.id] || []}
              onToggle={(optId) => onToggleMulti(group, optId)}
            />
          )
        )}
      </div>

      <div style={styles.modifierFooter}>
        <QuantityStepper quantity={quantity} onChange={onQuantityChange} />
        <button
          onClick={onAddToCart}
          disabled={!canAdd}
          style={{
            ...styles.addToCartButton,
            ...(!canAdd ? styles.addToCartButtonDisabled : null),
          }}
        >
          <span style={styles.addToCartButtonText}>Add to cart · {money(unitPrice * quantity)}</span>
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Right panel — cart
// ----------------------------------------------------------------------------

function CartLine({ line, onIncrement, onDecrement, onRemove }) {
  const lineTotal = line.unit_price * line.quantity;
  return (
    <div style={styles.cartLine}>
      <div style={styles.cartLineTopRow}>
        <span style={{ ...styles.cartLineName, ...clampStyle(2) }}>{line.name}</span>
        <div onClick={() => onRemove(line.cartLineId)} role="button" tabIndex={0}>
          <span style={styles.cartLineRemove}>✕</span>
        </div>
      </div>

      {line.options.length > 0 && (
        <div style={{ ...styles.cartLineModifiers, ...clampStyle(3) }}>
          {line.options.map((m) => m.name).join(', ')}
        </div>
      )}

      <div style={styles.cartLineBottomRow}>
        <div style={styles.cartLineQtyStepper}>
          <div
            onClick={() => onDecrement(line.cartLineId)}
            role="button"
            tabIndex={0}
            style={styles.cartQtyButton}
          >
            <span style={styles.cartQtyButtonText}>−</span>
          </div>
          <span style={styles.cartQtyValue}>{line.quantity}</span>
          <div
            onClick={() => onIncrement(line.cartLineId)}
            role="button"
            tabIndex={0}
            style={styles.cartQtyButton}
          >
            <span style={styles.cartQtyButtonText}>+</span>
          </div>
        </div>
        <span style={styles.cartLinePrice}>{money(lineTotal)}</span>
      </div>
    </div>
  );
}

function CartPanel({ cart, orderInfo, onIncrement, onDecrement, onRemove, onProcess }) {
  const subtotal = cart.reduce((sum, line) => sum + line.unit_price * line.quantity, 0);
  const isEmpty = cart.length === 0;
  const typeCfg = orderInfo?.service_type ? ORDER_TYPE_LABELS[orderInfo.service_type] : null;

  return (
    <div style={styles.cartPanel}>
      <div style={styles.cartHeading}>Current order</div>

      {orderInfo?.customer?.name ? (
        <div style={styles.cartCustomerRow}>
          <span style={{ ...styles.cartCustomerName, ...clampStyle(1) }}>{orderInfo?.customer?.name}</span>
          {typeCfg && (
            <div style={{ ...styles.cartTypeBadge, backgroundColor: typeCfg.bg }}>
              <span style={{ ...styles.cartTypeBadgeText, color: typeCfg.color }}>{typeCfg.label}</span>
            </div>
          )}
        </div>
      ) : null}

      {isEmpty ? (
        <div style={styles.cartEmptyState}>
          <span style={styles.cartEmptyText}>Tap a menu item to add it here</span>
        </div>
      ) : (
        <div style={styles.cartScroll}>
          {cart.map((line) => (
            <CartLine
              key={line.cartLineId}
              line={line}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}

      <div style={styles.cartSummary}>
        <div style={styles.cartSummaryRow}>
          <span style={styles.cartSummaryLabel}>Subtotal</span>
          <span style={styles.cartSummaryValue}>{money(subtotal)}</span>
        </div>
        <div style={styles.cartSummaryDivider} />
        <div style={styles.cartSummaryRow}>
          <span style={styles.cartSummaryLabelBold}>Total</span>
          <span style={styles.cartSummaryValueBold}>{money(subtotal)}</span>
        </div>
      </div>
      {subtotal > 0 ? <PaymentMethodScreen /> : null}
      <button
        onClick={onProcess}
        disabled={isEmpty}
        style={{
          ...styles.processButton,
          ...(isEmpty ? styles.processButtonDisabled : null),
        }}
      >
        <span style={styles.processButtonText}>Process Payment</span>
      </button>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Main screen
// ----------------------------------------------------------------------------

export default function OrderCreationScreen({ orderInfo }) {
  const [activeCategoryId, setActiveCategoryId] = useState(CATEGORIES[0].id);
  const [activeItem, setActiveItem] = useState(null); // item currently being customized
  const [modifierSelections, setModifierSelections] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);

  const activeCategory = CATEGORIES.find((c) => c.id === activeCategoryId);
  const activeCategoryItems = ITEMS_BY_CATEGORY[activeCategoryId] || [];

  const canAdd = useMemo(() => {
    if (!activeItem) return false;
    return activeItem.modifierGroups.every(
      (g) => g.type !== 'single' || !g.required || !!modifierSelections[g.id]
    );
  }, [activeItem, modifierSelections]);

  const unitPrice = useMemo(() => {
    if (!activeItem) return 0;
    const resolved = resolveSelectedModifiers(activeItem, modifierSelections);
    return activeItem.price + resolved.reduce((s, m) => s + m.price, 0);
  }, [activeItem, modifierSelections]);

  const handleSelectCategory = (categoryId) => {
    setActiveCategoryId(categoryId);
    // Selecting a new category always returns to the items grid.
    setActiveItem(null);
  };

  const addLineToCart = (item, resolvedModifiers, qty) => {
    const modifiersPrice = resolvedModifiers.reduce((s, m) => s + m.price, 0);
    setCart((prev) => [
      ...prev,
      {
        cartLineId: `${item.id}-${Date.now()}`,
        id: item.id,
        name: item.name,
        unit_price: item.price + modifiersPrice,
        price: (item.price + modifiersPrice) * qty,
        quantity: qty,
        options: resolvedModifiers,
      },
    ]);
  };

  const handleSelectItem = (item) => {
    if (!item.modifierGroups || item.modifierGroups.length === 0) {
      // No modifiers — add straight to cart, items grid stays visible.
      addLineToCart(item, [], 1);
      return;
    }
    // Has modifiers — hide the items grid and show the modifier view.
    const initialSelections = {};
    item.modifierGroups.forEach((group) => {
      initialSelections[group.id] = group.type === 'single' ? (group.required ? group.options[0].id : null) : [];
    });
    setModifierSelections(initialSelections);
    setQuantity(1);
    setActiveItem(item);
  };

  const handleSelectSingleModifier = (groupId, optionId) => {
    setModifierSelections((prev) => ({ ...prev, [groupId]: optionId }));
  };

  const handleToggleMultiModifier = (group, optionId) => {
    setModifierSelections((prev) => {
      const current = prev[group.id] || [];
      let next;
      if (current.includes(optionId)) {
        next = current.filter((id) => id !== optionId);
      } else {
        if (group.maxSelect && current.length >= group.maxSelect) return prev;
        next = [...current, optionId];
      }
      return { ...prev, [group.id]: next };
    });
  };

  const handleBackFromModifiers = () => {
    setActiveItem(null);
    setModifierSelections({});
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!activeItem || !canAdd) return;
    const resolved = resolveSelectedModifiers(activeItem, modifierSelections);
    addLineToCart(activeItem, resolved, quantity);
    handleBackFromModifiers();
  };

  const handleIncrementLine = (cartLineId) => {
    setCart((prev) => prev.map((l) => (l.cartLineId === cartLineId ? { ...l, quantity: l.quantity + 1, price: (l.price/l.quantity) * (l.quantity + 1) } : l)));
  };

  const handleDecrementLine = (cartLineId) => {
    setCart((prev) =>
      prev
        .map((l) => (l.cartLineId === cartLineId ? { ...l, quantity: l.quantity - 1, price: (l.price/l.quantity) * (l.quantity - 1) } : l))
        .filter((l) => l.quantity > 0)
    );
  };

  const handleRemoveLine = (cartLineId) => {
    setCart((prev) => prev.filter((l) => l.cartLineId !== cartLineId));
  };

  const handleProcessOrder = () => {
    // Hook this up to your order-submission / payment flow.
    console.log('Processing order:', cart);
  };

  return (
    <div style={styles.safeArea}>
      <div style={styles.container}>
        <button style={styles.backButton} aria-label="Go back">
            <Link to="/"><ChevronLeftIcon /></Link>
          </button>
        {/* Left: categories */}
        <CategoryList
          categories={CATEGORIES}
          activeCategoryId={activeCategoryId}
          onSelect={handleSelectCategory}
        />

        {/* Middle: items grid, or modifier view when an item with modifiers is selected */}
        <div style={styles.middlePanel}>
          {activeItem ? (
            <ItemModifierView
              item={activeItem}
              selections={modifierSelections}
              quantity={quantity}
              onSelectSingle={handleSelectSingleModifier}
              onToggleMulti={handleToggleMultiModifier}
              onQuantityChange={setQuantity}
              onBack={handleBackFromModifiers}
              onAddToCart={handleAddToCart}
              canAdd={canAdd}
              unitPrice={unitPrice}
            />
          ) : (
            <ItemsGrid
              categoryName={activeCategory?.name}
              items={activeCategoryItems}
              onSelectItem={handleSelectItem}
            />
          )}
        </div>

        {/* Right: cart */}
        <CartPanel
          cart={cart}
          orderInfo={orderInfo}
          onIncrement={handleIncrementLine}
          onDecrement={handleDecrementLine}
          onRemove={handleRemoveLine}
          onProcess={handleProcessOrder}
        />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Styles — plain JS objects used as inline styles (React DOM auto-appends
// "px" to unitless numeric values, same as React Native's StyleSheet did).
// ----------------------------------------------------------------------------

const styles = {
  safeArea: {
    display: 'flex',
    flex: 1,
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
  },
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
  },
  thumbnailFallback: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Left: category panel — fixed width, kept at or under 100px as requested
  categoryPanel: {
    maxWidth: 90,
    borderRight: '1px solid #EEF0F2',
    backgroundColor: '#FAFAFA',
    overflowY: 'auto',
  },
  categoryScroll: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 6,
    paddingRight: 6,
    gap: 10,
  },
  categoryRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 6,
    paddingRight: 6,
    borderRadius: 14,
    marginBottom: 6,
    cursor: 'pointer',
  },
  categoryRowActive: {
    backgroundColor: '#111827',
  },
  categoryLabel: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: 700,
    color: '#374151',
    textAlign: 'center',
  },
  categoryLabelActive: {
    color: '#FFFFFF',
  },

  // Middle: shared container
  middlePanel: {
    flex: 1.5,
    borderRight: '1px solid #EEF0F2',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  // Middle: items grid
  itemsGridScroll: {
    padding: 18,
    overflowY: 'auto',
  },
  categoryHeading: {
    fontSize: 20,
    fontWeight: 800,
    color: '#111827',
    marginBottom: 14,
  },
  itemsGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  itemCard: {
    width: 140,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    border: '1px solid #EEF0F2',
    borderRadius: 16,
    padding: 12,
    cursor: 'pointer',
  },
  itemCardPressed: {
    opacity: 0.7,
  },
  itemCardName: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: 700,
    color: '#111827',
    textAlign: 'center',
  },
  itemCardPrice: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: 600,
    color: '#6B7280',
  },

  // Middle: modifier view
  modifierViewContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
  },
  modifierViewHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 16,
    paddingBottom: 4,
  },
  backButton: {
    width: 30,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    cursor: 'pointer',
  },
  backButtonText: {
    fontSize: 20,
    color: '#111827',
  },
  modifierViewTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#111827',
  },
  modifierScroll: {
    paddingLeft: 18,
    paddingRight: 18,
    paddingBottom: 24,
    overflowY: 'auto',
    flex: 1,
  },
  modifierItemHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 18,
  },
  modifierItemName: {
    fontSize: 18,
    fontWeight: 800,
    color: '#111827',
  },
  modifierItemBasePrice: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: 600,
    color: '#6B7280',
  },
  modifierGroupBlock: {
    marginBottom: 20,
  },
  modifierGroupHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modifierGroupTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#111827',
  },
  requiredTag: {
    fontSize: 11,
    fontWeight: 700,
    color: '#9CA3AF',
  },
  optionRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottom: '1px solid #F3F4F6',
    cursor: 'pointer',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    border: '2px solid #D1D5DB',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  radioOuterActive: {
    borderColor: '#111827',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#111827',
  },
  checkboxOuter: {
    width: 20,
    height: 20,
    borderRadius: 6,
    border: '2px solid #D1D5DB',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  checkboxOuterActive: {
    borderColor: '#111827',
    backgroundColor: '#111827',
  },
  checkboxTick: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 800,
  },
  optionName: {
    flex: 1,
    fontSize: 14,
    fontWeight: 600,
    color: '#111827',
  },
  optionPrice: {
    fontSize: 13,
    fontWeight: 600,
    color: '#6B7280',
  },
  modifierFooter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 14,
    paddingBottom: 14,
    borderTop: '1px solid #EEF0F2',
  },
  qtyStepper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  qtyButton: {
    width: 38,
    height: 38,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: 700,
    color: '#111827',
  },
  qtyValue: {
    minWidth: 26,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 700,
    color: '#111827',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingTop: 14,
    paddingBottom: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
  },
  addToCartButtonDisabled: {
    backgroundColor: '#D1D5DB',
    cursor: 'not-allowed',
  },
  addToCartButtonText: {
    fontSize: 14,
    fontWeight: 700,
    color: '#FFFFFF',
  },

  // Right: cart panel
  cartPanel: {
    width: 300,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 16,
    paddingBottom: 18,
    overflowY: 'auto',
  },
  cartHeading: {
    fontSize: 17,
    fontWeight: 800,
    color: '#111827',
    marginBottom: 12,
  },
  cartCustomerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -6,
    marginBottom: 14,
  },
  cartCustomerName: {
    flex: 1,
    fontSize: 13,
    fontWeight: 600,
    color: '#6B7280',
    marginRight: 8,
  },
  cartTypeBadge: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: 10,
  },
  cartTypeBadgeText: {
    fontSize: 11,
    fontWeight: 700,
  },
  cartEmptyState: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  cartEmptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  cartScroll: {
    paddingBottom: 8,
    overflowY: 'auto',
    flex: 1,
  },
  cartLine: {
    paddingTop: 12,
    paddingBottom: 12,
    borderBottom: '1px solid #F3F4F6',
  },
  cartLineTopRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cartLineName: {
    flex: 1,
    fontSize: 14,
    fontWeight: 700,
    color: '#111827',
    marginRight: 8,
  },
  cartLineRemove: {
    fontSize: 13,
    color: '#9CA3AF',
    cursor: 'pointer',
  },
  cartLineModifiers: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  cartLineBottomRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cartLineQtyStepper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
  },
  cartQtyButton: {
    width: 28,
    height: 28,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  cartQtyButtonText: {
    fontSize: 15,
    fontWeight: 700,
    color: '#111827',
  },
  cartQtyValue: {
    minWidth: 20,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 700,
    color: '#111827',
  },
  cartLinePrice: {
    fontSize: 14,
    fontWeight: 700,
    color: '#111827',
  },
  cartSummary: {
    marginTop: 10,
    paddingTop: 12,
    borderTop: '1px solid #EEF0F2',
  },
  cartSummaryRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingBottom: 4,
  },
  cartSummaryLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  cartSummaryValue: {
    fontSize: 13,
    fontWeight: 600,
    color: '#111827',
  },
  cartSummaryLabelBold: {
    fontSize: 16,
    fontWeight: 800,
    color: '#111827',
  },
  cartSummaryValueBold: {
    fontSize: 16,
    fontWeight: 800,
    color: '#111827',
  },
  cartSummaryDivider: {
    height: 1,
    backgroundColor: '#EEF0F2',
    marginTop: 6,
    marginBottom: 6,
  },
  processButton: {
    marginTop: 14,
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingTop: 16,
    paddingBottom: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    border: 'none',
    cursor: 'pointer',
  },
  processButtonDisabled: {
    backgroundColor: '#D1D5DB',
    cursor: 'not-allowed',
  },
  processButtonText: {
    fontSize: 15,
    fontWeight: 700,
    color: '#FFFFFF',
  },
};