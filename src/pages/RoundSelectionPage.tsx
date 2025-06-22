import React, { useState } from 'react';
import styled from 'styled-components';

interface RoundSelectionPageProps {
  onSelectRound: (round: number) => void;
  availableMoviesCount: number; // 실제 사용 가능한 영화 수를 바탕으로 강 수를 제안할 수 있도록
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Heading = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.primary};
`;

const Description = styled.p`
  margin-bottom: 30px;
  font-size: 1.1rem;
`;

const RoundButtonGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
`;

const RoundButton = styled.button<{ selected: boolean }>`
  background-color: ${({ selected, theme }) => selected ? theme.colors.primary : theme.colors.darkGray};
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: color: ${({ selected, theme }) => selected ? theme.colors.primary : '#444'};
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const SelectButton = styled.button`
  padding: 12px 25px;
  font-size: 1.1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const RoundSelectionPage: React.FC<RoundSelectionPageProps> = ({ onSelectRound, availableMoviesCount }) => {
  const [selectedRound, setSelectedRound] = useState<number>(0);
  const possibleRounds = [4, 8, 16, 32, 64]; // 만들 수 있는 강 수

  const isRoundSelectable = (round: number) => {
    return availableMoviesCount >= round;
  };

  const handleSubmit = () => {
    if (selectedRound > 0) {
      onSelectRound(selectedRound);
    } else {
      alert("강 수를 선택해주세요.");
    }
  };

  return (
    <PageContainer>
      <Heading>월드컵 강 수를 선택하세요</Heading>
      <Description>
        선택한 장르에서 {availableMoviesCount}개 이상의 영화를 가져올 수 있습니다. <br/>
        (영화 수가 부족하면 월드컵 진행이 어려울 수 있습니다)
      </Description>
      <RoundButtonGrid>
        {possibleRounds.map((round) => (
          <RoundButton
            key={round}
            selected={selectedRound === round}
            onClick={() => setSelectedRound(round)}
            disabled={!isRoundSelectable(round) && round > 16} // 16강 초과는 영화 개수 제한
          >
            {round}강
          </RoundButton>
        ))}
      </RoundButtonGrid>
      <SelectButton onClick={handleSubmit} disabled={selectedRound === 0}>
        월드컵 시작!
      </SelectButton>
    </PageContainer>
  );
};

export default RoundSelectionPage;