import React from 'react';
import useUserStore from '../../stores/userStore';
import { usePermissions, useHasPermission } from '../../hooks/usePermissions';
import PermissionGuard from './PermissionGuard';  

/**
 * Simple example component demonstrating the updated permission system
 */
const PermissionUsageExample = () => {
  const { user } = useUserStore();
  const { permissions, permissionCodes } = usePermissions();
  const canViewDashboard = useHasPermission('dashboard:view');
  const canViewReports = useHasPermission('report:view');
  const { hasPermissionByCode } = useUserStore();

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>Permission System Demo</h2>
      
      {/* User Info */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h3>👤 Current User</h3>
        <p><strong>Name:</strong> {user?.name || 'Not logged in'}</p>
        <p><strong>Role:</strong> {user?.role_id || 'N/A'}</p>
        <p><strong>Permissions:</strong> {permissions.filter(p => p).length} of {permissions.length}</p>
      </div>

      {/* Permission Status */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
        <h3>🔐 Permission Status</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
          {permissionCodes.map((code, index) => (
            <div 
              key={code}
              style={{ 
                padding: '6px', 
                borderRadius: '3px', 
                backgroundColor: permissions[index] ? '#d4edda' : '#f8d7da',
                color: permissions[index] ? '#155724' : '#721c24',
                fontSize: '11px',
                textAlign: 'center'
              }}
            >
              {code.split(':')[1]}: {permissions[index] ? '✅' : '❌'}
            </div>
          ))}
        </div>
      </div>

      {/* Example 1: Using Custom Hooks */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>🎣 Custom Hooks Example</h3>
        
        {canViewDashboard && (
          <button style={{ backgroundColor: '#007bff', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', marginRight: '10px' }}>
            Dashboard Access ✅
          </button>
        )}
        
        {canViewReports && (
          <button style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px' }}>
            Reports Access ✅
          </button>
        )}
        
        {!canViewDashboard && !canViewReports && (
          <p style={{ color: '#6c757d', fontStyle: 'italic' }}>No special permissions detected</p>
        )}
      </div>

      {/* Example 2: Using PermissionGuard */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>🛡️ PermissionGuard Example</h3>
        
        <PermissionGuard permission="product:view">
          <div style={{ backgroundColor: '#fff3cd', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
            <h4>📦 Product Management</h4>
            <p>You have access to product management features.</p>
            <button style={{ backgroundColor: '#ffc107', color: 'black', padding: '6px 10px', border: 'none', borderRadius: '3px' }}>
              Manage Products
            </button>
          </div>
        </PermissionGuard>
        
        <PermissionGuard permission="settings:view" fallback={<p style={{ color: '#dc3545' }}>⚙️ Settings access denied</p>}>
          <div style={{ backgroundColor: '#d1ecf1', padding: '10px', borderRadius: '4px' }}>
            <h4>⚙️ Settings</h4>
            <p>You have access to system settings.</p>
            <button style={{ backgroundColor: '#17a2b8', color: 'white', padding: '6px 10px', border: 'none', borderRadius: '3px' }}>
              Open Settings
            </button>
          </div>
        </PermissionGuard>
      </div>

      {/* Example 3: Using Utility Functions */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>🔧 Utility Functions Example</h3>
        
        {hasPermissionByCode('inventory:view') && (
          <div style={{ backgroundColor: '#d4edda', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
            <h4>📊 Inventory Management</h4>
            <p>You can manage inventory levels and stock.</p>
          </div>
        )}
        
        {hasPermissionByCode('customer:view') && (
          <div style={{ backgroundColor: '#e2e3e5', padding: '10px', borderRadius: '4px' }}>
            <h4>👥 Customer Management</h4>
            <p>You can view and manage customer information.</p>
          </div>
        )}
      </div>

      {/* Example 4: Complex Logic */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>🧠 Complex Permission Logic</h3>
        
        {hasPermissionByCode('dashboard:view') && hasPermissionByCode('report:view') && (
          <div style={{ backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
            <h4>👑 Full Admin Access</h4>
            <p>You have both dashboard and report access - full admin privileges!</p>
            <button style={{ backgroundColor: '#dc3545', color: 'white', padding: '6px 10px', border: 'none', borderRadius: '3px' }}>
              Admin Panel
            </button>
          </div>
        )}
        
        {hasPermissionByCode('dashboard:view') && !hasPermissionByCode('report:view') && (
          <div style={{ backgroundColor: '#fff3cd', padding: '10px', borderRadius: '4px' }}>
            <h4>📋 Limited Access</h4>
            <p>You have dashboard access but not report access.</p>
          </div>
        )}
      </div>  

      {/* Debug Info */}
      <details style={{ marginTop: '20px' }}>
        <summary style={{ cursor: 'pointer', color: '#6c757d' }}>🔍 Debug Information</summary>
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px', fontSize: '12px' }}>
          <p><strong>Permissions Array:</strong> {JSON.stringify(permissions)}</p>
          <p><strong>Permission Codes:</strong> {JSON.stringify(permissionCodes)}</p>
          <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
          <p><strong>User Email:</strong> {user?.email || 'N/A'}</p>
        </div>
      </details>
    </div>
  );
};

export default PermissionUsageExample; 