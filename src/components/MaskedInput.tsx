import styled from 'styled-components';
import { IMaskInput } from 'react-imask';

const StyledMaskedInput = styled(IMaskInput)`
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.secondary};
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
`;

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  mask: string; // exemplo: "(00) 00000-0000"
  onlyNumbers?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MaskedInput = ({ label, mask, onlyNumbers, onChange, ...props }: MaskedInputProps) => {
  const handleAccept = (value: string) => {
    let finalValue = value;
    if (onlyNumbers) {
      finalValue = value.replace(/\D/g, '');
    }

    if (onChange) {
      onChange({
        target: { value: finalValue },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontWeight: 600, color: '#fff' }}>{label}</label>
      <StyledMaskedInput
        mask={mask}
        {...(props as any)}
        onAccept={handleAccept}
      />
    </div>
  );
};
