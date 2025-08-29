import React from 'react';
import ReactSelect from 'react-select';
import styled from 'styled-components';

type Option = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  isSearchable?: boolean;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: 'Rajdhani', sans-serif;

  .select__control {
    background-color: ${(props) => props.theme.colors.surface};
    color: ${(props) => props.theme.colors.white};
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: none;
    &:hover {
      border-color: ${(props) => props.theme.colors.primary};
    }
  }

  .select__menu {
    background-color: ${(props) => props.theme.colors.surface};
    color: ${(props) => props.theme.colors.text};
  }

  .select__single-value {
    color: ${(props) => props.theme.colors.white};
  }

  .select__option--is-focused {
    background-color: ${(props) => props.theme.colors.primary};
    color: white;
  }
`;

export const Select = ({ label, value, options, onChange, isSearchable = false }: Props) => {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Wrapper>
      <label>{label}</label>
      <ReactSelect
        classNamePrefix="select"
        value={selectedOption}
        onChange={(option) => option && onChange(option.value)}
        options={options}
        isSearchable={isSearchable}
      />
    </Wrapper>
  );
};
