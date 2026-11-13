from pathlib import Path
import json
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4,landscape
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader

R=Path(__file__).resolve().parents[1]
OUT=R/'output/pdf/Park_Janghan_AI_Game_Maker_Portfolio.pdf'
P={p['slug']:p for p in json.loads((R/'content/projects.json').read_text(encoding='utf-8'))}
pdfmetrics.registerFont(TTFont('Malgun','C:/Windows/Fonts/malgun.ttf'))
pdfmetrics.registerFont(TTFont('MalgunBold','C:/Windows/Fonts/malgunbd.ttf'))
W,H=landscape(A4);BG='#111720';TEXT='#edf2fa';MUTED='#b1bfd0';LINE='#344154';PANEL='#18212e'
VIOLET='#d4bfff';GOLD='#f4ce83';MINT='#87e1ce';BLUE='#a9d7ff'
BASE='https://msg1150.github.io/ai-game-maker-portfolio/'
c=canvas.Canvas(str(OUT),pagesize=(W,H));c.setTitle('박장한 | AI Game Maker Portfolio');c.setAuthor('박장한');c.setSubject('AI 리더십, 구조화 능력, 학습 실행력과 프로젝트별 본인 기여')
styles={}
for name,size,leading,col,font in [('body',10.7,17,MUTED,'Malgun'),('small',9,14,MUTED,'Malgun'),('title',31,39,TEXT,'MalgunBold'),('head',18,25,TEXT,'MalgunBold'),('sub',12,18,TEXT,'MalgunBold')]:
 styles[name]=ParagraphStyle(name,fontName=font,fontSize=size,leading=leading,textColor=HexColor(col),wordWrap='CJK',spaceAfter=0)
def para(text,x,y,width,style='body'):
 p=Paragraph(escape(text).replace('\n','<br/>'),styles[style]);_,h=p.wrap(width,1000);assert y-h>35,(text,y,h);p.drawOn(c,x,y-h);return y-h

def label(text,x,y,col):
 c.setFillColor(HexColor(col));c.setFont('MalgunBold',9);c.drawString(x,y,text)
def box(x,y,w,h):
 c.setFillColor(HexColor(PANEL));c.setStrokeColor(HexColor(LINE));c.roundRect(x,y,w,h,10,fill=1,stroke=1)
def link(text,url,x,y,col=BLUE):
 c.setFillColor(HexColor(col));c.setFont('MalgunBold',10);c.drawString(x,y,text);width=pdfmetrics.stringWidth(text,'MalgunBold',10);c.linkURL(url,(x,y-3,x+width,y+12),relative=0,thickness=0)
def image(name,x,y,w,h):
 img=ImageReader(str(R/'assets'/name));iw,ih=img.getSize();scale=min(w/iw,h/ih);dw,dh=iw*scale,ih*scale;c.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,width=dw,height=dh,mask='auto')
def start(page,kicker,title,color):
 c.setFillColor(HexColor(BG));c.rect(0,0,W,H,fill=1,stroke=0);label(kicker,38,H-34,color);para(title,38,H-48,W-76,'title');c.setStrokeColor(HexColor(LINE));c.line(38,33,W-38,33);c.setFillColor(HexColor(MUTED));c.setFont('Malgun',8);c.drawString(38,19,'박장한 / AI Game Maker / wkdgks88009@gmail.com');c.drawRightString(W-38,19,f'{page} / 5');c.setFont('Malgun',7.5);c.drawRightString(W-38,H-32,'2026.11.13')
def finish():c.showPage()
start(1,'PERSONAL PORTFOLIO','박장한 | AI Game Maker',BLUE)
y=para('문제를 정의하고 AI에 구현 기준을 전달한 뒤, 플레이와 테스트로 결과를 확인합니다.',38,H-105,W-76,'head')
items=[('AI 리더십',VIOLET,'사람과 AI의 역할을 구분','DungeonSweeper의 추격 문제를 발견하고 마지막 목격 위치 수색이라는 기준을 정했습니다. Codex 구현 뒤 플레이 영상으로 결과를 확인했습니다.','dungeonsweeper/#awareness'),('구조화 능력',GOLD,'실행할 단위로 문제를 분해','GOLDEN SHIFT의 무료 전환을 화면 입력, 서버 처리, DB 제약과 이전 기록 보존으로 나누어 검증했습니다.','golden-shift/#free-play'),('학습 실행력',MINT,'피드백을 다음 구현에 적용','FormuDoku에서 오답과 점수 누락을 발견하고 규칙을 수정했습니다. 점수 설정과 기능별 파일을 분리하고 진행 복구를 보완했습니다.','formudoku/#score-revision')]
width=(W-100)/3
for i,(name,col,head,body,url) in enumerate(items):
 x=38+i*(width+12);box(x,167,width,239);label(name,x+15,384,col);yy=para(head,x+15,365,width-30,'sub');para(body,x+15,yy-14,width-30);link('사례와 결과 보기',BASE+'projects/'+url,x+15,184,col)
para('개인 프로젝트 3개 / 팀 프로젝트 1개',38,145,W-76,'sub');para('개인 프로젝트는 기획 기준과 AI 요청, 결과 검증을 연결했습니다. 팀 프로젝트는 본인 담당 도구와 기능 범위를 명시했습니다.',38,122,W-76)
link('공개 포트폴리오 / 영상과 요청 원문',BASE,38,64);link('GitHub', 'https://github.com/msg1150',345,64)
finish()
# Each project page makes contribution, implementation and evidence immediately visible.
def project_page(page,slug,col,kicker,headline,visual,caption,blocks,links,quote=None,quote_label='실제 요청 발췌'):
 p=P[slug];start(page,kicker,headline,col);para(p['tagline'],38,H-102,W-76,'sub')
 box(38,228,360,220);image(visual,48,238,340,200);para(caption,38,216,360,'small')
 yy=448
 for heading,body in blocks:
  label(heading,423,yy,col);yy=para(body,423,yy-12,W-461)-18
 if quote:
  label(quote_label,38,161,col);para(quote,38,148,360,'small')
 else:
  label('기여 범위',38,161,col);para('팀 전체 결과물 중 레벨 검증과 JSON 도구, 투사체, 포탈 및 전투 NPC 경로를 담당했습니다.',38,148,360,'small')
 for i,(text,url) in enumerate(links):link(text,url,38+i*255,62,col)
 finish()
d=P['dungeonsweeper'];project_page(2,'dungeonsweeper',VIOLET,'01 / 개인 개발 / AI 리더십','DungeonSweeper','dungeon-awareness.webp','직접 플레이한 화면 / 발견 -> 추격 -> 마지막 목격 위치 수색',[
 ('내가 발견하고 정한 기준','시야를 조금 벗어나면 몬스터가 바로 순찰로 돌아갔습니다. 마지막 목격 위치까지 이동한 뒤 수색하도록 행동 기준을 정했습니다.'),
 ('Codex에 요청한 구현','수색 상태 전환과 4방향 BFS 경로, BoxCast 통과 검사를 구현하도록 요청했습니다. 던전 후보를 시드로 생성하고 채택하는 에디터 도구도 구성했습니다.'),
 ('확인한 결과','수정 후 추격 및 수색 영상을 제시합니다. 던전 생성은 1150 -> 1151 -> 1150 시드 왕복으로 같은 도면이 재현되는 시연을 제공합니다.')],
 [('추격 개선 요청과 플레이 영상',BASE+'projects/dungeonsweeper/#awareness'),('던전 생성 도구 시연',BASE+'projects/dungeonsweeper/#dungeon-tools')],d['cases'][0]['prompts'][0]['text'])
g=P['golden-shift'];project_page(3,'golden-shift',GOLD,'02 / 개인 개발 / 구조화 능력','GOLDEN SHIFT','golden-worksites.webp','제공된 일터 화면 / 일꾼 생산 -> 가상 골드 -> 일터 확장과 모의 투자',[
 ('내가 정한 변경 범위','v0.16에서 슬롯은 축하 연출만, 블랙잭은 승패만 남기고 베팅과 골드 보상을 제거했습니다. 성장 경제와 미니게임을 분리했습니다.'),
 ('AI와 나눈 구현 단위','화면의 베팅 입력 제거, 과거 API의 bet 값 무시, 확률 아이템 비활성화, 0G 블랙잭용 DB 제약 변경을 나누어 구현했습니다. 새 가입만 24시간 1회용 초대를 사용합니다.'),
 ('검증과 공개 범위','제공 소스의 로컬 테스트 74개가 통과했습니다. 기존 계정과 게임 기록 보존, 과거 클라이언트 요청을 검사했습니다. 운영 DB/배포는 별도 미확인입니다. 공개 플레이와 초대 URL은 넣지 않았습니다.')],
 [('무료 전환 범위와 검증',BASE+'projects/golden-shift/#free-play'),('기존 계정과 초대 정책',BASE+'projects/golden-shift/#invite-access')],g['cases'][0]['prompts'][0]['text'])
f=P['formudoku'];project_page(4,'formudoku',MINT,'03 / 개인 개발 / 학습 실행력 / v0.6.5','FormuDoku','formudoku-gameplay.webp','v0.3 초기 촬영 / 현재 일반 정답은 150점 지급 후 잠금. 최신 UI와 다릅니다.',[
 ('플레이에서 발견하고 정한 규칙','캐주얼 일반 칸의 점수 누락과 오답 판정을 수정했습니다. 일반 정답은 150점을 한 번 지급하고 잠그며, 새 오답은 목숨을 줄입니다. 수식은 최고점 차액만 더합니다.'),
 ('AI에 요청한 구조 개선','점수를 공통 설정으로 분리하고 화면, 입력, 서버와 CSS를 기능별 파일로 나누도록 요청했습니다. 문구와 색상 고정값 검사 대신 규칙과 기록 보존을 검사합니다.'),
 ('현재 구현과 검증','통신 실패 후 결과 복구, 다중 탭 충돌과 이전 저장 복구를 보완했습니다. 필수 테스트 27개가 통과했고 공개 health의 v0.6.5와 주요 모듈의 소스 일치를 확인했습니다. 모바일 실기기 전체 플레이와 부하 검증은 별도입니다.')],
 [('최신 점수 규칙과 개선 기록',BASE+'projects/formudoku/#score-revision'),('로그인 없이 게임 살펴보기','https://formudoku.goldenshift.workers.dev/')],next(q['text'] for ca in f['cases'] for q in ca.get('prompts',[]) if q['label'].startswith('제공 기록 / 후속 30')),quote_label='제공 개발 기록의 요청 발췌')
a=P['battlearena'];project_page(5,'battlearena',BLUE,'04 / 팀 프로젝트 / AI와 개선한 본인 담당 도구','BattleArena','arena-level-validator.webp','제공 캡처 / PathLink 지면 이격 검출과 Focus. 후속 Attach 추가 전 화면입니다.',[
 ('내가 정한 검사와 수정 흐름','정상적인 공중 TargetPoint의 오검출을 줄이고 실제 연결값을 검사하도록 기준을 정했습니다. PathLink Attach와 Undo/Redo 후 재검사를 요청하고 툴 창이 열렸을 때만 실행하도록 제한했습니다.'),
 ('JSON과 외부 편집기가 필요했던 이유','패키징 뒤에도 기획자가 게임 수치를 수정해 테스트하도록 데이터 조정과 빌드를 분리하려 했습니다. 파싱은 값을 게임에 적용하고, 외부 편집기는 표와 속성 UI로 편집을 돕습니다. 패키징 폴더 편집도 후속 요청했습니다.'),
 ('AI와의 분담 및 확인 범위','본인이 요구와 조건을 정하고 ChatGPT/Codex가 검사와 저장 코드를 구현했습니다. 현재 공개 소스 9개를 대조했습니다. 당시 빌드와 플레이 확인 기록은 보존하며 이번에 Unreal 실행을 재검증한 결과로 표현하지 않습니다.')],
 [('검사 기준과 Attach 개선 요청',BASE+'projects/battlearena/#level-validator'),('외부 JSON과 편집기 제작 목적',BASE+'projects/battlearena/#json-runtime')],next(case for case in a['cases'] if case['id']=='validator-repair')['prompts'][1]['text'],quote_label='제공 기록의 사용자 요청 / 2026.10.29')
c.save();print(OUT)
