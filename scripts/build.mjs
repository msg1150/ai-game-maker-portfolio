import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const projects = JSON.parse(await read('content/projects.json')).filter((project) => project.published !== false);
const siteUrl = 'https://msg1150.github.io/ai-game-maker-portfolio/';
const profile = 'https://github.com/msg1150';
const email = 'wkdgks88009@gmail.com';
const esc = (text) => String(text).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));
const icon = '<svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none"><path d="M3 8h9m-4-4 4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const favicon = createHash('sha256').update(await read('assets/mark.svg')).digest('hex').slice(0, 8);
const css = createHash('sha256').update(await read('assets/site.css')).digest('hex').slice(0, 8);
const js = createHash('sha256').update(await read('assets/site.js')).digest('hex').slice(0, 8);

function prose(text, highlights = []) {
  if (!highlights.length) return esc(text);
  const terms = [...highlights].sort((a, b) => b.length - a.length);
  const pattern = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  return text.split(new RegExp(`(${pattern})`, 'g')).map((part, index) =>
    index % 2 ? `<strong class="text-accent">${esc(part)}</strong>` : esc(part)).join('');
}

const projectPath = (project) => `projects/${project.slug}/`;
const techLogos = new Map([
  ['Unity', 'devicon/unity.svg'],
  ['C#', 'devicon/csharp.svg'],
  ['JavaScript', 'jsconf/javascript.svg'],
  ['Cloudflare Workers', 'cloudflare/workers.svg'],
  ['D1', 'cloudflare/d1.svg'],
  ['ChatGPT', 'openai/chatgpt.png'],
  ['Codex', 'openai/codex.png'],
  ['Unreal Engine 5.6.1', 'devicon/unrealengine.svg'],
  ['C++', 'devicon/cplusplus.svg'],
  ['Blueprint', 'unreal/blueprint.svg'],
]);

function tags(items, prefix) {
  return `<ul class="tags" aria-label="사용 기술">${items.map((item) => {
    const logo = techLogos.get(item);
    const label = esc(item);
    if (!logo) return `<li class="tag-text">${label}</li>`;
    return `<li class="tag-logo" title="${label}"><img src="${prefix}assets/icons/${logo}" alt="${label}" width="22" height="22"><span class="tag-touch-label" aria-hidden="true">${label}</span></li>`;
  }).join('')}</ul>`;
}
const actions = (links = []) => links.length ? `<div class="actions">${links.map(([label, url]) =>
  `<a class="button" href="${esc(url)}">${esc(label)}${icon}</a>`).join('')}</div>` : '';
const cover = (project, prefix, eager = false) =>
  `<img src="${prefix}assets/${esc(project.cover)}" alt="${esc(project.coverAlt)}" width="${project.width}" height="${project.height}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;

function layout({ title, description, path = '', project, body }) {
  const prefix = project ? '../../' : './';
  const url = new URL(path, siteUrl).href;
  const shareCover = project?.cover ?? projects[0].cover;
  const imageMeta = shareCover.endsWith('.webp') ? `<meta property="og:image" content="${new URL(`assets/${shareCover}`, siteUrl).href}">\n  ` : '';
  const navProjects = projects.map((item) => `<a href="${prefix}${projectPath(item)}"${item === project ? ' aria-current="page"' : ''}>${esc(item.name)}</a>`).join('');
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#111720">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  ${imageMeta}<link rel="canonical" href="${url}">
  <link rel="icon" href="${prefix}assets/mark.svg?v=${favicon}" type="image/svg+xml">
  <link rel="stylesheet" href="${prefix}assets/site.css?v=${css}">
  <script src="${prefix}assets/site.js?v=${js}" defer></script>
  <title>${esc(title)}</title>
</head>
<body class="${project ? `tone-${project.tone}` : 'home'}">
  <a class="skip" href="#main">본문으로 건너뛰기</a>
  <header class="site-header">
    <div class="shell header-inner">
      <a class="brand" href="${prefix}" aria-label="박장한 포트폴리오 홈"><span class="mark" aria-hidden="true">PJH</span><span>박장한 <small>AI Game Maker</small></span></a>
      <nav class="site-nav" aria-label="프로젝트 탐색">${navProjects}<a class="contact-link" href="#contact">연락처</a></nav>
    </div>
  </header>
  <main id="main">${body}</main>
  <footer class="shell site-footer" id="contact">
    <div><p class="eyebrow"><span>CONTACT</span></p><h2>박장한</h2></div>
    <div class="footer-links">
      <a href="mailto:${email}">${email}</a>
      <a href="${profile}">GitHub ${icon}</a>
    </div>
  </footer>
</body>
</html>
`;
}

function projectCard(project, prefix) {
  return `<article class="project-card tone-${project.tone}">
    <a href="${prefix}${projectPath(project)}">
      <div class="card-image">${cover(project, prefix)}<span>${esc(project.coverLabel)}</span></div>
      <div class="card-body">
        <p class="eyebrow"><span>${project.number}</span> ${esc(project.category)}</p>
        <h3>${esc(project.name)}</h3>
        <p>${esc(project.cardSummary ?? project.tagline)}</p>
        ${tags(project.stack, prefix)}
        <span class="card-action">프로젝트 보기 ${icon}</span>
      </div>
    </a>
  </article>`;
}

function home() {
  const [featured, ...other] = projects;
  return layout({
    title: '박장한 | AI Game Maker Portfolio',
    description: '박장한의 게임 기획, AI 협업 개발과 플레이 검증 포트폴리오.',
    body: `
      <section class="hero">
        <div class="shell hero-inner">
          <div class="hero-copy">
            <p class="eyebrow"><span>PERSONAL PORTFOLIO</span></p>
            <h1>박장한</h1>
            <p class="hero-role">AI Game Maker</p>
            <p class="hero-summary">문제를 정의하고 AI에 구현 기준을 전달한 뒤, <strong class="text-accent">플레이와 테스트로 결과를 확인합니다.</strong></p>
            <div class="actions">
              <a class="button primary" href="#projects">프로젝트 보기${icon}</a>
              <a class="button" href="./assets/park-janghan-ai-game-maker-portfolio.pdf">포트폴리오 PDF${icon}</a>
              <a class="button icon-button" href="mailto:${email}" aria-label="이메일" title="이메일"><img src="./assets/icons/lucide/mail.svg" alt="" width="18" height="18"></a>
              <a class="button icon-button" href="${profile}" aria-label="GitHub 프로필" title="GitHub 프로필"><img src="./assets/icons/devicon/github.svg" alt="" width="18" height="18"></a>
            </div>
          </div>
          <a class="feature tone-${featured.tone}" href="./${projectPath(featured)}">
            <div class="feature-media">${cover(featured, './', true)}<span>게임 타이틀 화면</span></div>
            <div class="feature-caption"><div><p class="eyebrow"><span>01</span> 대표 프로젝트</p><strong>${esc(featured.name)}</strong></div><span class="round-icon">${icon}</span></div>
          </a>
        </div>
      </section>
      <section class="home-evidence" id="highlights">
        <div class="shell section">
          <div class="section-head"><div><p class="eyebrow"><span>01</span> PROBLEM SOLVING</p><h2>사례로 보여주는 문제 해결 역량</h2></div></div>
          <div class="competency-grid">
            <article class="competency-card tone-violet">
              <p class="eyebrow"><span>01</span> AI 리더십</p>
              <h3>수정 기준은 직접 정하고,<br>구현은 AI와 나눕니다.</h3>
              <p>몬스터가 추격을 너무 빨리 멈추는 문제를 발견하고, 마지막 목격 위치까지 수색하도록 Codex에 요청했습니다.</p>
              <a href="./projects/dungeonsweeper/#awareness">실제 요청과 플레이 결과 ${icon}</a>
            </article>
            <article class="competency-card tone-gold">
              <p class="eyebrow"><span>02</span> 구조화 능력</p>
              <h3>규칙 변경을 화면, 서버,<br>데이터 보존으로 나눕니다.</h3>
              <p>무료 미니게임 전환을 입력 제거, 구버전 API 처리, DB 제약 변경으로 나누고 기존 기록 보존까지 검사했습니다.</p>
              <a href="./projects/golden-shift/#free-play">변경 범위와 검증 결과 ${icon}</a>
            </article>
            <article class="competency-card tone-mint">
              <p class="eyebrow"><span>03</span> 학습 실행력</p>
              <h3>플레이 피드백을 받아<br>다음 구현에 적용합니다.</h3>
              <p>수식 입력이 반복되면 불편하다는 피드백을 캐주얼 모드와 별도 점수로 옮기고, 모바일 하단 입력도 개선했습니다.</p>
              <a href="./projects/formudoku/#mode-split">피드백과 모드 설계 ${icon}</a>
            </article>
          </div>
        </div>
      </section>
      <section class="shell section" id="projects">
        <div class="section-head">
          <div><p class="eyebrow"><span>02</span> SELECTED WORK</p><h2>프로젝트</h2>
            <p class="section-intro">개인 게임의 기획과 AI 협업 과정, 팀 프로젝트에서 맡은 구현과 제작 도구를 정리했습니다.</p></div>
        </div>
        <div class="project-grid">${[featured, ...other].map((item) => projectCard(item, './')).join('')}</div>
      </section>
`,
  });
}

function caseMedia(media) {
  if (!media) return '';
  const asset = `../../assets/${esc(media.image)}`;
  if (media.gif) {
    return `<figure class="evidence">
      <details class="gif-demo">
        <summary><img src="${asset}" width="${media.width}" height="${media.height}" alt="" loading="lazy"><span class="gif-closed">무음 GIF 보기</span><span class="gif-open">GIF 접기</span></summary>
        <img src="../../assets/${esc(media.gif)}" width="${media.width}" height="${media.height}" alt="${esc(media.alt)}" loading="lazy">
      </details>
      <figcaption>${esc(media.caption)}</figcaption>
    </figure>`;
  }
  const content = media.video ?
    `<video controls playsinline preload="none" width="${media.width}" height="${media.height}" style="aspect-ratio: ${media.width} / ${media.height}" poster="${asset}" aria-label="${esc(media.alt)}"><source src="../../assets/${esc(media.video)}" type="video/mp4"><a href="../../assets/${esc(media.video)}">MP4 영상 열기</a></video>` :
    `<img src="${asset}" width="${media.width}" height="${media.height}" alt="${esc(media.alt)}" loading="lazy" decoding="async">`;
  const fullSize = media.fullSize ? ` <a href="${asset}">원본 크기로 보기</a>` : '';
  return `<figure class="evidence">${content}<figcaption>${esc(media.caption)}${fullSize}</figcaption></figure>`;
}

function promptList(prompts = []) {
  if (!prompts.length) return '';
  const grouped = prompts.length > 1;
  const summary = grouped ? `관련 요청 발췌 (${prompts.length}건)` : prompts[0].label;
  return `<details class="prompt">
    <summary>${esc(summary)}</summary>
    ${prompts.map(({ label, text }) => `<div class="prompt-body">
      ${grouped ? `<h4>${esc(label)}</h4>` : ''}
      <pre><code>${esc(text).replace(/\r?\n/g, '&#10;')}</code></pre>
      <div class="prompt-tools"><button type="button" data-copy hidden>프롬프트 복사</button><span class="copy-status" role="status"></span></div>
    </div>`).join('')}
  </details>`;
}

function caseVisual(item) {
  const flow = item.flow ? `<ol class="case-flow" aria-label="구현 흐름">${item.flow.map((step) => `<li>${esc(step)}</li>`).join('')}</ol>` : '';
  const comparison = item.comparison ? `<div class="evidence-pair">${item.comparison.map(caseMedia).join('')}</div>` : '';
  const table = item.table ? `<div class="case-table-wrap"><table class="case-table">
    <caption>${esc(item.table.caption)}</caption>
    <thead><tr>${item.table.headers.map((cell) => `<th scope="col">${esc(cell)}</th>`).join('')}</tr></thead>
    <tbody>${item.table.rows.map(([label, ...cells]) => `<tr><th scope="row">${esc(label)}</th>${cells.map((cell) => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>` : '';
  return flow + table + comparison + caseMedia(item.media);
}

function renderCase(item, index) {
  const visual = caseVisual(item);
  const copy = (text) => prose(text, item.highlights);
  const kind = item.media || item.comparison || item.table ? '' : item.flow ? ' case--diagram' : ' case--copy';
  return `<article class="case${kind}" id="${item.id}">
    <div class="case-head"><p class="eyebrow"><span>CASE 0${index + 1}</span> ${esc(item.label)}</p><h3>${esc(item.title)}</h3></div>
    <div class="case-layout">
      <dl class="case-copy">
        <div><dt>목표</dt><dd>${copy(item.problem)}</dd></div>
        <div><dt>바꾼 점</dt><dd>${copy(item.implementation)}</dd></div>
        ${item.verification ? `<div><dt>결과</dt><dd>${copy(item.verification)}</dd></div>` : ''}
      </dl>
      ${visual ? `<div class="case-visual">${visual}</div>` : ''}
    </div>
    ${promptList(item.prompts)}
    ${actions(item.links)}
  </article>`;
}

function detail(project) {
  const { name, summary, roles, planning, cases, timeline, gallery, section } = project;
  const heading = project.titleParts
    ? project.titleParts.map((part) => `<span class="hero-title-part">${esc(part)}</span>`).join('<wbr>')
    : esc(name);
  return layout({
    title: `${name} | 박장한 AI Game Maker`,
    description: summary,
    path: projectPath(project),
    project,
    body: `
      <section class="hero project-hero">
        <div class="shell">
          <nav class="crumb" aria-label="현재 위치"><a href="../../">포트폴리오</a><span aria-hidden="true">/</span><span>${esc(name)}</span></nav>
          <div class="hero-inner">
            <div class="hero-copy">
              <p class="eyebrow"><span>PROJECT ${project.number}</span> ${esc(project.category)}</p>
              <h1>${heading}</h1>
              <p class="hero-lede">${esc(project.tagline)}</p>
              <p class="hero-summary">${esc(summary)}</p>
              ${tags(project.stack, '../../')}
              ${actions([['사례 및 영상 보기', '#cases'], ...project.links])}
            </div>
            <figure class="project-cover">${cover(project, '../../', true)}<figcaption>${esc(project.coverLabel)}</figcaption></figure>
          </div>
        </div>
      </section>
      <div class="shell detail">
        <nav class="local-nav" aria-label="페이지 목차">
          <a href="#role">역할</a>${planning ? '<a href="#planning">초기 기획</a>' : ''}${timeline ? '<a href="#timeline">개발 이력</a>' : ''}<a href="#cases">구현 사례</a>${gallery ? '<a href="#gallery">인게임 화면</a>' : ''}<a href="#${section.id}">${esc(section.label)}</a>
        </nav>
        ${project.loop ? `<section class="loop" aria-labelledby="loop-title"><h2 id="loop-title">핵심 플레이 루프</h2><ol>${project.loop.map((item) => `<li>${esc(item)}</li>`).join('')}</ol></section>` : ''}
        <section id="role" class="detail-section">
          <p class="eyebrow"><span>ROLE</span> CONTRIBUTION</p>
          <h2>${project.slug === 'battlearena' ? '팀 프로젝트에서 맡은 역할' : '내 역할과 AI의 역할'}</h2>
          <div class="role-grid">${roles.map(([label, text]) => `<div><h3>${esc(label)}</h3><p>${esc(text)}</p></div>`).join('')}</div>
        </section>
        ${planning ? `<section id="planning" class="detail-section">
          <p class="eyebrow"><span>PLAN</span> GAME DESIGN</p>
          <h2>${esc(planning.title)}</h2>
          <p class="prose">${prose(planning.text, planning.highlights)}</p>
        </section>` : ''}
        ${timeline ? `<section id="timeline" class="detail-section"><p class="eyebrow"><span>HISTORY</span> ITERATION</p><h2>주요 개발 이력</h2>
          <ol class="timeline">${timeline.map(([version, title, text]) => `<li><span>${esc(version)}</span><div><h3>${esc(title)}</h3><p>${esc(text)}</p></div></li>`).join('')}</ol></section>` : ''}
        <section id="cases" class="detail-section">
          <p class="eyebrow"><span>CASES</span> IMPLEMENTATION</p><h2>구현 사례</h2>
          <div class="case-list">${cases.map(renderCase).join('')}</div>
        </section>
        ${gallery ? `<section id="gallery" class="detail-section">
          <p class="eyebrow"><span>SCREENSHOTS</span> GAME SYSTEMS</p><h2>인게임 화면</h2>
          <div class="gallery">${gallery.map(caseMedia).join('')}</div>
        </section>` : ''}
        <section id="${section.id}" class="detail-section">
          <p class="eyebrow"><span>NOTES</span> ${esc(section.label)}</p><h2>${esc(section.title)}</h2>
          <p class="prose">${esc(section.text)}</p>
          ${section.notes ? `<div class="section-evidence">
            <div class="role-grid">${section.notes.map(([label, text]) => `<div><h3>${esc(label)}</h3><p>${prose(text, section.highlights)}</p></div>`).join('')}</div>
            ${caseMedia(section.media)}
          </div>` : ''}
          ${actions(section.links)}
        </section>
        <nav class="related" aria-label="다른 프로젝트">
          <a href="../../#projects">프로젝트 목록</a>${projects.filter((item) => item !== project).map((item) => `<a href="../../${projectPath(item)}">${esc(item.name)} ${icon}</a>`).join('')}
        </nav>
      </div>`,
  });
}

const clean = (html) => html.replace(/[ \t]+$/gm, '');
await writeFile(new URL('index.html', root), clean(home()));
for (const project of projects) {
  const directory = new URL(projectPath(project), root);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), clean(detail(project)));
}
