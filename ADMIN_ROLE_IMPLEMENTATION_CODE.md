# Admin Role Hidden Permissions - Implementation Code

## 🛠️ Step-by-Step Implementation

### Step 1: Add Permission Hiding Logic to RolesConfig.jsx

Add this function at the top of the component:

```javascript
const shouldHidePermission = (module, permission, roleName) => {
  // Only apply restrictions to admin role
  if (roleName !== 'admin') return false;

  // Define which permissions should be hidden for admin role
  const hiddenPermissions = {
    // Cannot Add (system configs or auto-generated)
    generalSettings: ['add'],
    organizationDetails: ['add'],
    daySettings: ['add'],
    seriesConfiguration: ['add'],
    attendance: ['add'],
    leaveAttendance: ['add'],

    // Cannot Delete (critical/financial data)
    roles: ['delete'],
    departments: ['delete'],
    organizationDetails: ['delete'],
    seriesConfiguration: ['delete'],
    payroll: ['delete'],
    paysheet: ['delete'],

    // Cannot see at all (read-only features)
    leaderboard: ['view', 'add', 'edit', 'delete', 'all'],
  };

  // Check if this module has hidden permissions
  if (!hiddenPermissions[module]) return false;
  
  // Check if this specific permission should be hidden
  return hiddenPermissions[module].includes(permission);
};
```

---

### Step 2: Create Component to Conditionally Render Permissions

Create a helper component that wraps ModuleAccessRow:

```javascript
const ConditionalModuleAccessRow = ({ 
  moduleKey, 
  moduleName, 
  permissions, 
  onPermissionChange, 
  disabled,
  roleName 
}) => {
  // Hide module completely if all permissions are hidden
  const allPermissionsHidden = ['view', 'add', 'edit', 'delete', 'all'].every(
    perm => shouldHidePermission(moduleKey, perm, roleName)
  );

  if (allPermissionsHidden) return null;

  // Module is visible, show it
  return (
    <ModuleAccessRow
      moduleKey={moduleKey}
      moduleName={moduleName}
      permissions={permissions}
      onPermissionChange={onPermissionChange}
      disabled={disabled || shouldHidePermission(moduleKey, 'all', roleName)}
    />
  );
};
```

---

### Step 3: Update ModuleAccessRow Component

Modify ModuleAccessRow in `src/components/ModuleAccessRow.jsx` to accept hidden permissions:

```javascript
const ModuleAccessRow = ({ 
  moduleKey, 
  moduleName, 
  permissions, 
  onPermissionChange, 
  disabled,
  hiddenPermissions = [] // NEW parameter
}) => {
  return (
    <TableRow>
      <Cell>{moduleName}</Cell>
      
      {/* View permission */}
      {!hiddenPermissions.includes('view') ? (
        <Cell onClick={() => onPermissionChange(moduleKey, 'view')}>
          <Checkbox checked={permissions.view} disabled={disabled} />
        </Cell>
      ) : (
        <Cell> </Cell> {/* Empty cell for alignment */}
      )}

      {/* Add permission */}
      {!hiddenPermissions.includes('add') ? (
        <Cell onClick={() => onPermissionChange(moduleKey, 'add')}>
          <Checkbox checked={permissions.add} disabled={disabled} />
        </Cell>
      ) : (
        <Cell> </Cell>
      )}

      {/* Edit permission */}
      {!hiddenPermissions.includes('edit') ? (
        <Cell onClick={() => onPermissionChange(moduleKey, 'edit')}>
          <Checkbox checked={permissions.edit} disabled={disabled} />
        </Cell>
      ) : (
        <Cell> </Cell>
      )}

      {/* Delete permission */}
      {!hiddenPermissions.includes('delete') ? (
        <Cell onClick={() => onPermissionChange(moduleKey, 'delete')}>
          <Checkbox checked={permissions.delete} disabled={disabled} />
        </Cell>
      ) : (
        <Cell> </Cell>
      )}

      {/* All permission */}
      {!hiddenPermissions.includes('all') ? (
        <Cell onClick={() => onPermissionChange(moduleKey, 'all')}>
          <Checkbox checked={permissions.all} disabled={disabled} />
        </Cell>
      ) : (
        <Cell> </Cell>
      )}
    </TableRow>
  );
};
```

---

### Step 4: Replace ModuleAccessRow Calls in RolesConfig.jsx

Update all ModuleAccessRow calls to use the new logic:

```javascript
// Helper function to get hidden permissions for a module
const getHiddenPermissionsForModule = (module) => {
  const hiddenPermsMap = {
    generalSettings: ['add', 'delete'],
    organizationDetails: ['add', 'delete'],
    daySettings: ['add', 'delete'],
    seriesConfiguration: ['add', 'delete'],
    attendance: ['add'],
    leaveAttendance: ['add'],
    roles: ['delete'],
    departments: ['delete'],
    payroll: ['delete'],
    paysheet: ['delete'],
    leaderboard: ['view', 'add', 'edit', 'delete', 'all'],
  };

  return hiddenPermsMap[module] || [];
};

// Then in the render section:

{/* Time Hub - Attendance */}
{getHiddenPermissionsForModule('attendance').length < 5 && (
  <ModuleAccessRow
    moduleKey="attendance"
    moduleName="Attendance"
    permissions={permissions.attendance}
    onPermissionChange={handlePermissionChange}
    disabled={!moduleToggles.timeHub}
    hiddenPermissions={getHiddenPermissionsForModule('attendance')}
  />
)}

{/* Settings - General Settings */}
{getHiddenPermissionsForModule('generalSettings').length < 5 && (
  <ModuleAccessRow
    moduleKey="generalSettings"
    moduleName="General Settings"
    permissions={permissions.generalSettings}
    onPermissionChange={handlePermissionChange}
    disabled={!moduleToggles.settings}
    hiddenPermissions={getHiddenPermissionsForModule('generalSettings')}
  />
)}

// ... repeat for all modules
```

---

### Step 5: Add Backend Validation

In your backend (e.g., Node.js/Express):

```javascript
// Middleware to validate role permissions
const validateRolePermissions = (req, res, next) => {
  const { name, permissions } = req.body;

  // Only enforce for admin role
  if (name === 'admin') {
    const forbiddenPermissions = {
      generalSettings: ['add', 'delete'],
      organizationDetails: ['add', 'delete'],
      daySettings: ['add', 'delete'],
      seriesConfiguration: ['add', 'delete'],
      attendance: ['add'],
      leaveAttendance: ['add'],
      roles: ['delete'],
      departments: ['delete'],
      payroll: ['delete'],
      paysheet: ['delete'],
    };

    // Check if any forbidden permissions are being granted
    if (Array.isArray(permissions)) {
      permissions.forEach((group) => {
        if (group.modules) {
          group.modules.forEach((module) => {
            const forbidden = forbiddenPermissions[module.module];
            if (forbidden) {
              forbidden.forEach((perm) => {
                if (module.permissions[perm] === true) {
                  return res.status(400).json({
                    success: false,
                    message: `Admin role cannot have "${perm}" permission on "${module.module}"`
                  });
                }
              });
            }
          });
        }
      });
    }
  }

  next();
};

// Apply middleware to role creation/update endpoints
app.patch('/v1/roles/:roleId', validateRolePermissions, updateRoleHandler);
app.post('/v1/roles', validateRolePermissions, createRoleHandler);
```

---

## 📝 Complete Example for One Module

Here's a complete example showing how to implement for "General Settings":

```javascript
// Step 1: Define hidden permissions
const getHiddenPerms = (module) => ({
  generalSettings: ['add', 'delete'],
  // ... other modules
}[module] || []);

// Step 2: In render - check if module should be completely hidden
const isModuleHidden = (module) => 
  getHiddenPerms(module).length === 5; // All 5 perms hidden

// Step 3: For "General Settings" in Settings section
{/* Settings - General Settings */}
{!isModuleHidden('generalSettings') && (
  <ModuleAccessRow
    moduleKey="generalSettings"
    moduleName="General Settings"
    permissions={permissions.generalSettings}
    onPermissionChange={handlePermissionChange}
    disabled={!moduleToggles.settings}
    hiddenPermissions={getHiddenPerms('generalSettings')}
  />
)}
```

---

## 🧪 Testing Code

Add console logging to verify hidden permissions:

```javascript
// In RolesConfig.jsx useEffect or on save
useEffect(() => {
  if (isEditMode && formData.roleName === 'admin') {
    console.log('Admin Role Permissions:');
    
    // Check each module
    Object.entries(permissions).forEach(([module, perms]) => {
      const hidden = getHiddenPermissionsForModule(module);
      
      if (hidden.length > 0) {
        console.log(`  ${module}:`);
        console.log(`    Hidden: ${hidden.join(', ')}`);
        console.log(`    Current: `, perms);
        
        // Verify hidden permissions are not granted
        hidden.forEach(perm => {
          if (perms[perm] === true) {
            console.warn(`  ⚠️ WARNING: ${module}.${perm} should not be true for admin!`);
          }
        });
      }
    });
  }
}, [formData.roleName, permissions, isEditMode]);
```

---

## 🚀 Deployment Checklist

- [ ] Add `shouldHidePermission()` function
- [ ] Create `ConditionalModuleAccessRow` component
- [ ] Update `ModuleAccessRow` component
- [ ] Update all ModuleAccessRow calls with hiddenPermissions
- [ ] Add backend validation middleware
- [ ] Add console logging for testing
- [ ] Test with admin role - verify permissions hidden
- [ ] Test with other roles - verify all permissions visible
- [ ] Verify backend rejects invalid permissions
- [ ] Update admin documentation
- [ ] Deploy to staging for testing
- [ ] Deploy to production

---

## 🔍 Verification Steps

1. **Login as admin**
2. **Go to Settings → Roles**
3. **Edit admin role**
4. **Verify these are HIDDEN:**
   - Attendance: "Add" checkbox gone
   - General Settings: "Add" & "Delete" checkboxes gone
   - Leaderboard: Entire section hidden
   - Roles: "Delete" checkbox gone

5. **Verify these are VISIBLE:**
   - Dashboard: All permissions
   - Announcement: All permissions
   - Employees: All permissions

6. **Try to bypass via API:**
   - POST/PATCH role with forbidden permissions
   - Should get 400 error from backend

---

## 📊 Before & After

**BEFORE**:
```
General Settings: [ ] View [✓] Add [✓] Edit [✓] Delete [✓] All
Roles: [✓] View [✓] Add [✓] Edit [✓] Delete [✓] All
Leaderboard: [✓] View [✓] Add [✓] Edit [✓] Delete [✓] All
```

**AFTER** (for Admin role):
```
General Settings: [ ] View [ ] Add [✓] Edit [ ] Delete [ ] All
Roles: [✓] View [✓] Add [✓] Edit [ ] Delete [ ] All
Leaderboard: (completely hidden)
```

---

**Implementation Complete!** ✅  
Ready to integrate into your RolesConfig component.
