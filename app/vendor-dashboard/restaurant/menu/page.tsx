import React, { useState } from 'react';
import { MenuItem } from '../types';
import { menuItems } from '../data';

export default function MenuManagement() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <button onClick={() => setViewMode('grid')} style={{ marginRight: '1rem' }}>
            Grid View
          </button>
          <button onClick={() => setViewMode('table')}>Table View</button>
        </div>
        <button style={{ backgroundColor: '#0d9488', color: '#fff', padding: '0.5rem 1rem', borderRadius: 4 }}>
          + Add Menu
        </button>
      </div>

      {viewMode === 'grid' ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                width: '220px',
                borderRadius: '8px',
                backgroundColor: '#fff',
              }}
            >
              <img
                src={item.image || '/placeholder.jpg'}
                alt={item.name}
                style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
              />
              <h3 style={{ marginTop: '0.5rem' }}>{item.name}</h3>
              <p>{item.menuType}</p>
              <p>₦{item.price.toLocaleString()}</p>
              <p>{item.items ? `${item.items} items` : item.description}</p>
              <button style={{ marginTop: '0.5rem', backgroundColor: '#f59e0b', color: '#fff', padding: '0.4rem 0.8rem', border: 'none', borderRadius: '4px' }}>
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
          <thead>
            <tr style={{ textAlign: 'left', backgroundColor: '#f9fafb' }}>
              <th style={{ padding: '0.75rem' }}>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Menu Type</th>
              <th>Meal Times</th>
              <th>Items</th>
              <th>Tags</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '0.75rem' }}>
                  <img
                    src={item.image || '/placeholder.jpg'}
                    alt={item.name}
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </td>
                <td>{item.name}</td>
                <td>₦{item.price.toLocaleString()}</td>
                <td>{item.menuType}</td>
                <td>{item.mealTimes.join(', ')}</td>
                <td>{item.items ?? '-'}</td>
                <td>{item.tags?.join(', ')}</td>
                <td>
                  <input type="checkbox" checked={item.status} readOnly />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
