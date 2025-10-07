# MaMatch - 구슬 매칭 게임

3~5개의 구슬을 매칭해서 최대 점수를 얻는 퍼즐 게임입니다.

## 게임 규칙
- 8x8 보드에서 같은 색상의 구슬을 3개 이상 매칭
- 구슬이 터지면 위에서 새로운 구슬이 떨어짐
- 더 이상 매칭할 수 없으면 게임 오버
- 최고 점수 갱신을 목표로!

## 프로젝트 구조
```
src/
  ├── screens/      # 화면 컴포넌트
  ├── components/   # 재사용 가능한 UI 컴포넌트
  ├── utils/        # 유틸리티 함수
  ├── constants/    # 상수 및 설정
  ├── types/        # TypeScript 타입 정의
  └── assets/       # 이미지, 사운드 등
```

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. iOS 추가 설정 (iOS만 해당)
```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

### 3. 앱 실행

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

## 개발 환경 요구사항
- Node.js 18+
- React Native 0.81.4
- Android Studio (Android 개발)
- Xcode (iOS 개발)

## 주요 패키지
- `@react-native-async-storage/async-storage` - 로컬 데이터 저장
- `react-native-gesture-handler` - 제스처 처리
- `react-native-reanimated` - 애니메이션
