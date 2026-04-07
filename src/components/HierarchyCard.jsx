import React from "react";
import styled from "styled-components";
import theme from "../theme/theme";

const HierarchyCard = ({ 
  name, 
  employeeId, 
  department, 
  position, 
  profileImage,
}) => {
  return (
    <Card>
      <ProfileImage src={profileImage} alt={name} />
      <Name>{name}</Name>
      <EmployeeId>{employeeId}</EmployeeId>
      <DepartmentBox>
        <Department>{department}</Department>
        <Position>{position}</Position>
      </DepartmentBox>
    </Card>
  );
};

export default HierarchyCard;

const Card = styled.div`
  position: relative;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 0.625rem;
  padding: 0.625rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 12.75rem;
  height: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const ProfileImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  object-fit: cover;
  background: ${theme.colors.bgColor};
`;

const Name = styled.h3`
  font-weight: 600;
  font-size: 14px;
  line-height: 160%;
  letter-spacing: 0%;
  text-align: center;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.textColor};
  margin: 0.25rem 0 0 0;
`;

const EmployeeId = styled.p`
  font-size: 0.75rem;
  font-weight: 400;
  font-family: "Inter-Regular", sans-serif;
  color: ${theme.colors.secondaryText};
  margin: 0;
`;

const DepartmentBox = styled.div`
  background: #EDF6F9;
  border-radius: 4px;
  margin-top: 0.5rem;
  text-align: center;
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
`;

const Department = styled.p`
  font-size: 0.75rem;
  font-weight: 400;
  font-family: "Inter-Regular", sans-serif;
  color: ${theme.colors.secondaryText};
  margin: 0 0 0.25rem 0;
`;

const Position = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  font-family: "Inter-SemiBold", sans-serif;
  color: ${theme.colors.primary};
  margin: 0;
`;
