import styled from 'styled-components';

const StyledInput = styled.input`
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.secondary};
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
`;
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  onlyNumbers?: boolean;
}

export const Input = ({ label, onlyNumbers, onChange, ...props }: InputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (onlyNumbers) {
      value = value.replace(/\D/g, ''); // Remove tudo que não for número
    }
    onChange?.({ ...e, target: { ...e.target, value } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontWeight: 600 }}>{label}</label>
      <StyledInput {...props} onChange={handleChange} />
    </div>
  );
};