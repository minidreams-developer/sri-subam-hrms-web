/**
 * Protected Route Component
 * Enforces RBAC permission checks at the route level
 * Shows "Access Denied" page if user lacks VIEW permission
 */

import React from 'react';
import styled from 'styled-components';
import { canViewModule, getModulePermissionSet, isUserAdmin } from '../helpers/permissions_helper';
import theme from '../theme/theme';

const ProtectedRoute = ({ moduleKey, component: Component, ...rest }) => {
  // Admin users can access any route
  if (isUserAdmin()) {
    return <Component {...rest} />;
  }

  // Check if user has VIEW permission for this module
  const hasViewPermission = canViewModule(moduleKey);

  if (!hasViewPermission) {
    return <AccessDeniedPage moduleKey={moduleKey} />;
  }

  return <Component {...rest} />;
};

/**
 * Access Denied Page Component
 * Displayed when user lacks permission to view a module
 */
const AccessDeniedPage = ({ moduleKey }) => {
  const getModuleName = (key) => {
    const nameMap = {
      employees: 'Employee Management',
      agents: 'Agent Management',
      teams: 'Team Management',
      branches: 'Branch Management',
      departments: 'Department Management',
      leaveAttendance: 'Leave & Attendance',
      attendance: 'Attendance',
      shiftManagement: 'Shift Management',
      overtimeManagement: 'Overtime Management',
      dayOffHolidays: 'Holidays & Day Off',
      offBoarding: 'Off-Boarding',
      leaderboard: 'Leaderboard',
      payroll: 'Payroll',
      paysheet: 'Paysheet',
      stopPayroll: 'Stop Payroll',
      additionDeductions: 'Additions & Deductions',
      generalSettings: 'General Settings',
      organizationDetails: 'Organization Details',
      departments: 'Departments',
      roles: 'Roles & Permissions',
      daySettings: 'Day Settings',
      seriesConfiguration: 'Series Configuration',
      contractorOverview: 'Contractor Overview',
      contractorContractors: 'Contractors',
      contractorPayments: 'Contractor Payments',
      announcement: 'Announcements',
    };
    return nameMap[key] || key;
  };

  return (
    <Container>
      <Content>
        <IconWrapper>
          <LockIcon>🔒</LockIcon>
        </IconWrapper>
        <Title>Access Denied</Title>
        <Message>
          You do not have permission to access <strong>{getModuleName(moduleKey)}</strong>.
        </Message>
        <Subtitle>
          If you believe you should have access to this module, please contact your administrator.
        </Subtitle>
        <PermissionDetails>
          <DetailItem>
            <DetailLabel>Module:</DetailLabel>
            <DetailValue>{getModuleName(moduleKey)}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Required Permission:</DetailLabel>
            <DetailValue>View Access</DetailValue>
          </DetailItem>
        </PermissionDetails>
      </Content>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

const Content = styled.div`
  background: white;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
`;

const IconWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

const LockIcon = styled.div`
  font-size: 4rem;
  display: inline-block;
  opacity: 0.8;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${theme.colors.textColor};
  margin: 0 0 0.5rem 0;
  font-family: 'Inter', sans-serif;
`;

const Message = styled.p`
  font-size: 1rem;
  color: ${theme.colors.secondaryTextColor};
  margin: 0 0 1rem 0;
  line-height: 1.6;
  font-family: 'Inter', sans-serif;

  strong {
    color: ${theme.colors.textColor};
    font-weight: 600;
  }
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  font-family: 'Inter', sans-serif;
`;

const PermissionDetails = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1.5rem;
  text-align: left;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: ${theme.colors.textColor};
  font-size: 0.875rem;
  font-family: 'Inter', sans-serif;
`;

const DetailValue = styled.span`
  color: #6b7280;
  font-size: 0.875rem;
  font-family: 'Inter', sans-serif;
`;

export default ProtectedRoute;
