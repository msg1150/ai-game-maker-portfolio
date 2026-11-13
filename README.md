# AI Game Maker Portfolio

박장한의 AI 협업 게임 개발 포트폴리오입니다. GitHub Pages에서 저장소의 `main` 브랜치 루트를 게시합니다.

프로젝트 설명과 증빙 링크는 `content/projects.json`에서 관리합니다. 스타일은 `assets/site.css`, 공통 HTML은 `scripts/build.mjs`에서 수정합니다. Node.js로 `node scripts/build.mjs`를 실행한 후 생성된 메인과 상세 HTML을 함께 커밋합니다. 별도 패키지는 필요하지 않습니다.

DungeonSweeper와 BattleArena의 게임 화면, 영상은 기존 게임 클라이언트 포트폴리오의 공개 자료에서 가져왔습니다. GOLDEN SHIFT의 스크린샷과 요청 인용은 제공된 인게임 캡처 및 개발 대화 기록을 바탕으로 작성했습니다.

기술 로고와 연락 아이콘은 `assets/icons/`에 포함합니다. Unity, C#, Unreal Engine, C++, GitHub는 [Devicon](https://github.com/devicons/devicon/tree/6a37858047b0e8d9c9c0e68f4a071fc410652e89) 원본을 사용하며 MIT 라이선스를 함께 제공합니다. JavaScript는 [JSConf 커뮤니티 로고 원본](https://github.com/voodootikigod/logo.js)과 MIT 라이선스를 사용합니다. Cloudflare Workers와 D1은 [Cloudflare 공식 문서의 제품 아이콘](https://github.com/cloudflare/cloudflare-docs/tree/production/src/icons)입니다. 메일 아이콘은 [Lucide](https://github.com/lucide-icons/lucide/tree/20aef31db93fe4d9f398dbb15b120d99c48eef95) 원본입니다. Blueprint는 기존 기술 포트폴리오의 Epic Unreal Editor 아이콘을 재사용합니다.

Codex는 OpenAI가 배포한 Windows 앱의 Codex 전용 로고이고, ChatGPT는 [OpenAI 도움말에 게시된 공식 앱 아이콘](https://help.openai.com/en/articles/8142208-chatgpt-ios-and-android-app-faq)입니다. 두 이미지는 OpenAI 소유입니다.

## 웹 게임 최신 반영 (2026-11-12)

- FormuDoku v0.5.1: 캐주얼/챌린지와 모드별 점수, 브라우저 진행 및 서버 최종 검증, 모바일 하단 입력, 입력 단계 문법 제한을 반영했습니다. 기존 사용자 원문 요청은 당시 기획으로 유지하고 최신 요청을 관련 사례에 추가했습니다.
- GOLDEN SHIFT v0.16.0: 베팅/골드 보상 제거, 확률 아이템 비활성화, 24시간 1회용 신규 가입 초대 및 기존 기록 보존을 반영했습니다. 공개 플레이/초대 URL은 포함하지 않습니다.
- 예전 화면과 GIF는 촬영 버전을 캡션에 표시합니다. 최신 규칙 표와 구현 흐름은 설명용이며 실제 최신 게임 캡처가 아닙니다.
- 재실행한 로컬 테스트: FormuDoku 75개, GOLDEN SHIFT 74개 통과. 문서의 과거 테스트 개수 대신 현재 제공 소스에서 실행된 개수를 사용했습니다.
- FormuDoku 공개 app.js와 제공 소스의 SHA-256 일치를 확인했습니다. GOLDEN SHIFT v0.16 운영 DB/배포 및 두 게임의 운영 부하와 모바일 한 판 전체 플레이는 이번 작업에서 검증하지 않았습니다.

## 제출 안내 반영

메인에서 AI 리더십, 구조화 능력, 학습 실행력을 실제 사례에 연결합니다. 각 프로젝트에서 본인이 정한 기준과 AI에 요청한 구현, 확인한 결과를 구분하고 팀 프로젝트는 담당 기능 범위를 명시합니다. 개발 기록 전체나 실행 파일은 게시하지 않습니다.

`assets/park-janghan-ai-game-maker-portfolio.pdf`는 Google Drive 제출용 5쪽 요약입니다. 영상과 상세 요청은 로그인 없이 볼 수 있는 GitHub Pages 페이지로 연결합니다. Google Drive 업로드/공개 공유는 이 저장소에서 자동 수행하지 않습니다. PDF 재생성은 ReportLab과 맑은 고딕이 있는 환경에서 `python scripts/build-portfolio-pdf.py`를 실행하고 `output/pdf/`의 결과를 해당 assets 경로로 복사합니다.

## FormuDoku 최신 반영 (2026-11-13)

제공된 대화 기록은 v0.6.4까지이며 원시 원문 내보내기가 아닌 전사/축약임을 명시합니다. 추가 요청은 "제공 기록" 발췌로 표시합니다. 같은 폴더의 실제 소스와 공개 health는 v0.6.5입니다. 일반 정답 150점과 1회 잠금, 오답 목숨 차감, 공통 점수 설정, 기능별 모듈화와 완료 기록 복구를 반영했습니다.

v0.6.5 로컬 필수 테스트 27개가 통과했습니다. 공개 app.js, scoring-config.js, number-entry.js, game-session.js, board-theme.css와 service-worker.js가 로컬 소스와 일치함을 확인했습니다. 기존 게임 캡처와 GIF는 v0.3 자료로 표기하며 최신 UI 캡처로 대체하지 않습니다.

## BattleArena AI 협업 기록 반영 (2026-11-13)

제공된 Validator/JSON 개발 기록 4종을 비교했습니다. 최초 요청 원문이 없는 항목을 복원하지 않고, 사용자 문장으로 확인되는 발췌만 각 사례에 배치했습니다. 실제 사용 대상에 맞춘 검사 범위 축소, Attach/Undo/Redo와 탭 열림 조건, 에디터 저장의 JSON 역반영, Editor/Runtime 적용 분리를 중심으로 작성했습니다.

현행 기준은 공개 코드 `c65bde5b3418a73e0b753556612cb72ab355de0b`입니다. 관련 소스 9개의 Git blob 해시를 로컬 사본과 대조했습니다. 초기 포탈 DA/발사값 검사, 목적지 NavMesh 검사, DataEditor 패키징 양쪽 저장 등의 제안은 현행 구현과 혼합하지 않습니다. 당시 빌드/플레이 보고와 이번 정적 소스 검토를 구분하며 개발 기록 전문, 로컬 경로, 팀 비공개 로그와 실행 파일을 게시하지 않습니다.
