import React, { useState } from 'react';

// ----------------------------------------------------------------------------
// Mock order summary — replace with the cart/order passed from the previous
// screen (e.g. via navigation params or the orderInfo/cart state you already
// have in OrderCreationScreen).
// ----------------------------------------------------------------------------

const MOCK_ORDER_SUMMARY = {
  itemCount: 5,
  subtotal: 42.5,
  deliveryFee: 2.5,
  discount: 0,
  taxRate: 0.05,
};

const money = (n) => `£${n.toFixed(2)}`;

// ----------------------------------------------------------------------------
// Payment method options
// ----------------------------------------------------------------------------

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash', icon: '💵' },
  { id: 'card', label: 'Card', icon: '💳' },
  { id: 'scan', label: 'Scan', icon: 'scan' }, // custom drawn icon, see ScanIcon
];

// ----------------------------------------------------------------------------
// Small custom icon for the "Scan" option (QR-style corner brackets), since
// no single emoji reads clearly as a scan target at this size.
// ----------------------------------------------------------------------------

function ScanIcon({ color }) {
  return (
    <div style={styles.scanIconBox}>
      <div style={{ ...styles.scanCorner, ...styles.scanCornerTL, borderColor: color }} />
      <div style={{ ...styles.scanCorner, ...styles.scanCornerTR, borderColor: color }} />
      <div style={{ ...styles.scanCorner, ...styles.scanCornerBL, borderColor: color }} />
      <div style={{ ...styles.scanCorner, ...styles.scanCornerBR, borderColor: color }} />
    </div>
  );
}

// ----------------------------------------------------------------------------
// Payment method card
// ----------------------------------------------------------------------------

function PaymentMethodCard({ method, isSelected, onPress }) {
  const [pressed, setPressed] = useState(false);

  return (
    <div
      onClick={onPress}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      role="button"
      tabIndex={0}
      style={{
        ...styles.methodCard,
        ...(isSelected ? styles.methodCardSelected : null),
        ...(pressed ? styles.methodCardPressed : null),
      }}
    >
      <div
        style={{
          ...styles.methodIconCircle,
          ...(isSelected ? styles.methodIconCircleSelected : null),
        }}
      >
        {method.icon === 'scan' ? (
          <ScanIcon color={isSelected ? '#0D9488' : '#6B7280'} />
        ) : (
          <span style={styles.methodIconText}>{method.icon}</span>
        )}
      </div>
      <span
        style={{
          ...styles.methodLabel,
          ...(isSelected ? styles.methodLabelSelected : null),
        }}
      >
        {method.label}
      </span>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Order summary rows
// ----------------------------------------------------------------------------

function SummaryRow({ label, value, bold }) {
  return (
    <div style={styles.summaryRow}>
      <span style={{ ...styles.summaryLabel, ...(bold ? styles.summaryLabelBold : null) }}>{label}</span>
      <span style={{ ...styles.summaryValue, ...(bold ? styles.summaryValueBold : null) }}>{value}</span>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Main screen
// ----------------------------------------------------------------------------

export default function PaymentMethodScreen({
  orderSummary = MOCK_ORDER_SUMMARY,
  onBack,
  onConfirmPayment,
}) {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const { subtotal, deliveryFee, discount, taxRate } = orderSummary;
  const tax = subtotal * taxRate;
  const total = subtotal + deliveryFee + tax - discount;

  const handleConfirm = () => {
    if (!selectedMethod) return;
    onConfirmPayment?.(selectedMethod);
  };

  return (
    <div style={styles.safeArea}>
      {/*
      <div style={styles.scrollContent}>
        Order summary */}

      {/* Payment method */}
      <div style={styles.sectionTitle}>Payment Method</div>
      <div style={styles.methodsRow}>
        {PAYMENT_METHODS.map((method) => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            isSelected={selectedMethod === method.id}
            onPress={() => setSelectedMethod(method.id)}
          />
        ))}
      </div>
      {/*
      </div>

      <div style={styles.footer}>
        <button
          onClick={handleConfirm}
          disabled={!selectedMethod}
          style={{
            ...styles.confirmButton,
            ...(!selectedMethod ? styles.confirmButtonDisabled : null),
          }}
        >
          <span style={styles.confirmButtonText}>
            {selectedMethod ? `Confirm ${money(total)} payment` : 'Select a payment method'}
          </span>
        </button>
      </div>
      */}
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
    flexDirection: 'column',
  },
  summaryRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingBottom: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryLabelBold: {
    fontSize: 16,
    fontWeight: 800,
    color: '#111827',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 600,
    color: '#111827',
  },
  summaryValueBold: {
    fontSize: 16,
    fontWeight: 800,
    color: '#111827',
  },
  // Payment method
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#111827',
    marginTop: 20,
    marginBottom: 12,
  },
  methodsRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
  },
  methodCard: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 14,
    border: '1.5px solid #E5E7EB',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
  },
  methodCardSelected: {
    borderColor: '#14B8A6',
    backgroundColor: '#F0FDFA',
  },
  methodCardPressed: {
    opacity: 0.8,
  },
  methodIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 20,
    // backgroundColor: '#F3F4F6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  methodIconCircleSelected: {
    // backgroundColor: '#CCFBF1',
  },
  methodIconText: {
    fontSize: 10,
  },
  methodLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
  },
  methodLabelSelected: {
    color: '#0D9488',
    fontWeight: 700,
  },

  // Custom scan icon
  scanIconBox: {
    width: 10,
    height: 10,
    position: 'relative',
  },
  scanCorner: {
    position: 'absolute',
    width: 8,
    height: 8,
  },
  scanCornerTL: {
    top: 0,
    left: 0,
    borderTop: '2px solid transparent',
    borderLeft: '2px solid transparent',
  },
  scanCornerTR: {
    top: 0,
    right: 0,
    borderTop: '2px solid transparent',
    borderRight: '2px solid transparent',
  },
  scanCornerBL: {
    bottom: 0,
    left: 0,
    borderBottom: '2px solid transparent',
    borderLeft: '2px solid transparent',
  },
  scanCornerBR: {
    bottom: 0,
    right: 0,
    borderBottom: '2px solid transparent',
    borderRight: '2px solid transparent',
  },
};