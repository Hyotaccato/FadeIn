
### 🍿 FadeIn - 당신의 인생 영화는?
FadeIn은 사용자가 선택한 장르의 영화들을 월드컵 방식으로 대결시켜 최종 우승 영화를 선정하는 인터랙티브한 웹사이트입니다. 이 프로젝트는 React의 핵심 흐름과 외부 API 연동 방법을 실습하며 영화를 즐겁게 탐색할 수 있도록 고안되었습니다. TMDB API를 활용하여 방대한 영화 정보를 제공합니다. 장르와 강(라운드) 선택을 통해 사용자가 원하는 방식으로 영화 월드컵을 즐길 수 있습니다.

#### ✨ 주요 기능:
영화 장르 선택: 사용자가 원하는 영화 장르를 다중 선택하여 월드컵에 반영합니다.
월드컵 강(라운드) 선택: 16강, 32강, 64강 등 원하는 월드컵 규모를 선택할 수 있습니다.
영화 배틀: 선택된 영화들이 이미지와 함께 대결하며, 사용자의 선택에 따라 다음 라운드로 진출합니다.
최종 우승 영화 선정: 모든 라운드를 거쳐 단 하나의 우승 영화를 선정하고 상세 정보를 제공합니다.
반응형 디자인: 다양한 기기에서 최적화된 사용자 경험을 제공합니다.
인트로 화면: 앱 시작 시 로딩 애니메이션과 함께 부드러운 인트로 화면을 제공합니다.
별점 데이터 저장: 사용자가 준 별점을 웹사이트를 닫았다가 다시 열어도 로컬 스토리지에서 유지합니다.

#### 💡 학습 목표 및 성과:
React 핵심 흐름 이해
외부 API 연동 및 데이터 처리 실습
React Router를 활용한 라우팅 관리
Styled Components를 이용한 효율적인 스타일링
사용자 경험(UX) 개선 고려

#### 🖥️ 기술 스택:
React: SPA(Single Page Application) 개발을 위한 핵심 라이브러리
TypeScript: 코드의 안정성과 가독성을 높여주는 JavaScript의 상위 집합
React Router DOM: 페이지 간의 네비게이션 및 라우팅 관리
Styled Components: 컴포넌트 기반의 스타일링 솔루션
TMDB API: 영화 데이터를 가져오기 위한 RESTful API
Yarn: 패키지 관리자

#### 📂 프로젝트 구조:
```
FadeIn/
├── public/                 # 정적 파일
├── src/
│   ├── assets/             # 이미지, 아이콘 등 (아직 없으면 생성)
│   ├── components/         # 재사용 가능한 UI 컴포넌트
│   ├── pages/              # 각 페이지 컴포넌트
│   │   ├── GenreSelectionPage.tsx
│   │   ├── IntroScreen.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── MovieBattlePage.tsx
│   │   ├── RoundSelectionPage.tsx
│   │   └── WinnerPage.tsx
│   ├── services/           # TMDB API 연동 로직
│   │   └── tmdbService.ts
│   ├── styles/             # 전역 스타일 및 테마 정의
│   │   ├── GlobalStyle.ts
│   │   └── theme.ts
│   │   └── styled.d.ts     # styled-components 타입 정의
│   ├── App.tsx             # 메인 애플리케이션 컴포넌트
│   ├── index.tsx           # React 앱 진입점
│   ├── App.css
│   └── index.css
├── .env.example            # .env 파일 예시
├── .gitignore              # Git 버전 관리에서 제외할 파일 설정
├── package.json            # 프로젝트 의존성 및 스크립트
├── yarn.lock               # Yarn 패키지 잠금 파일
└── README.md               # 프로젝트 설명 문서
```
