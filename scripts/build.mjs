import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const projects = JSON.parse(await read('content/projects.json')).filter((project) => project.published !== false);
const siteUrl = 'https://msg1150.github.io/ai-game-maker-portfolio/';
const technical = 'https://msg1150.github.io/';
const profile = 'https://github.com/msg1150';
const email = 'wkdgks88009@gmail.com';
const esc = (text) => String(text).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));
const icon = '<svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none"><path d="M3 8h9m-4-4 4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const css = createHash('sha256').update(await read('assets/site.css')).digest('hex').slice(0, 8);
const js = createHash('sha256').update(await read('assets/site.js')).digest('hex').slice(0, 8);

const projectPath = (project) => `projects/${project.slug}/`;
const tags = (items) => `<ul class="tags" aria-label="사용 기술">${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`;
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
  <link rel="icon" href="${prefix}assets/mark.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${prefix}assets/site.css?v=${css}">
  <script src="${prefix}assets/site.js?v=${js}" defer></script>
  <title>${esc(title)}</title>
</head>
<body class="${project ? `tone-${project.tone}` : 'home'}">
  <a class="skip" href="#main">본문으로 건너뛰기</a>
  <header class="site-header">
    <div class="shell header-inner">
      <a class="brand" href="${prefix}" aria-label="박장한 포트폴리오 홈"><span class="mark" aria-hidden="true">PJ</span><span>박장한 <small>AI Game Maker</small></span></a>
      <nav class="site-nav" aria-label="프로젝트 탐색">${navProjects}<a class="contact-link" href="#contact">연락처</a></nav>
    </div>
  </header>
  <main id="main">${body}</main>
  <footer class="shell site-footer" id="contact">
    <div><p class="eyebrow"><span>CONTACT</span></p><h2>박장한</h2><p>게임 개발 및 AI 협업</p></div>
    <div class="footer-links">
      <a href="mailto:${email}">${email}</a>
      <a href="${profile}">GitHub ${icon}</a>
      <a href="${technical}">게임 클라이언트 포트폴리오 ${icon}</a>
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
        <p>${esc(project.tagline)}</p>
        ${tags(project.stack)}
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
            <p class="eyebrow"><span>PORTFOLIO</span> 박장한</p>
            <h1>AI Game Maker</h1>
            <p class="hero-lede">게임 규칙을 설계하고,<br>플레이로 결과를 확인합니다.</p>
            <p class="hero-summary">기획을 구현할 수 있는 요구사항으로 나누고, AI와 작업한 결과를 실제 플레이에서 확인하며 게임을 다듬습니다.</p>
            <div class="actions"><a class="button primary" href="#projects">프로젝트 보기${icon}</a><a class="button" href="${technical}">클라이언트 포트폴리오${icon}</a></div>
          </div>
          <a class="feature tone-${featured.tone}" href="./${projectPath(featured)}">
            <div class="feature-media">${cover(featured, './', true)}<span>게임 타이틀 화면</span></div>
            <div class="feature-caption"><div><p class="eyebrow"><span>01</span> 대표 프로젝트</p><strong>${esc(featured.name)}</strong></div><span class="round-icon">${icon}</span></div>
          </a>
        </div>
      </section>
      <section class="shell section" id="projects">
        <div class="section-head"><div><p class="eyebrow"><span>01</span> SELECTED WORK</p><h2>프로젝트</h2></div><p>개인 게임의 기획과 AI 협업부터<br>팀 프로젝트의 클라이언트 구현까지</p></div>
        <div class="project-grid">${[featured, ...other].map((item) => projectCard(item, './')).join('')}</div>
      </section>
      <section class="workflow">
        <div class="shell section">
          <div class="section-head"><div><p class="eyebrow"><span>02</span> WORKFLOW</p><h2>AI와 작업하는 방식</h2></div></div>
          <ol class="steps">
            <li><span>01</span><h3>플레이 규칙 정의</h3><p>플레이어가 무엇을 선택하는지, 어떤 결과가 나와야 하는지 정합니다.</p></li>
            <li><span>02</span><h3>구현 단위로 분해</h3><p>게임 상태, 화면 표현, 예외 조건을 나눠 AI에 구현 요구사항을 전달합니다.</p></li>
            <li><span>03</span><h3>플레이와 코드로 검증</h3><p>게임에서 문제를 재현하고, 수정된 동작을 영상·코드·테스트로 확인합니다.</p></li>
          </ol>
        </div>
      </section>`,
  });
}

function caseMedia(media) {
  if (!media) return '';
  const asset = `../../assets/${esc(media.image)}`;
  const content = media.video ?
    `<video controls playsinline preload="none" width="${media.width}" height="${media.height}" style="aspect-ratio: ${media.width} / ${media.height}" poster="${asset}" aria-label="${esc(media.alt)}"><source src="../../assets/${esc(media.video)}" type="video/mp4"><a href="../../assets/${esc(media.video)}">MP4 영상 열기</a></video>` :
    `<img src="${asset}" width="${media.width}" height="${media.height}" alt="${esc(media.alt)}" loading="lazy" decoding="async">`;
  return `<figure class="evidence">${content}<figcaption>${esc(media.caption)}</figcaption></figure>`;
}

function promptList(prompts = []) {
  return prompts.map(({ label, text }) => `<details class="prompt">
    <summary>${esc(label)}</summary>
    <div class="prompt-body">
      <pre><code>${esc(text)}</code></pre>
      <div class="prompt-tools"><button type="button" data-copy hidden>프롬프트 복사</button><span class="copy-status" role="status"></span></div>
    </div>
  </details>`).join('');
}

function renderCase(item, index) {
  return `<article class="case" id="${item.id}">
    <div class="case-head"><p class="eyebrow"><span>CASE 0${index + 1}</span> ${esc(item.label)}</p><h3>${esc(item.title)}</h3></div>
    <div class="${item.media ? 'case-layout' : ''}">
      <dl class="case-copy">
        <div><dt>목표와 판단</dt><dd>${esc(item.problem)}</dd></div>
        <div><dt>구현</dt><dd>${esc(item.implementation)}</dd></div>
        <div><dt>확인한 근거</dt><dd>${esc(item.verification)}</dd></div>
      </dl>
      ${caseMedia(item.media)}
    </div>
    ${promptList(item.prompts)}
    ${actions(item.links)}
  </article>`;
}

function detail(project) {
  const { name, summary, roles, cases, timeline, section } = project;
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
              <h1>${esc(name)}</h1>
              <p class="hero-lede">${esc(project.tagline)}</p>
              <p class="hero-summary">${esc(summary)}</p>
              ${tags(project.stack)}
              ${actions(project.links)}
            </div>
            <figure class="project-cover">${cover(project, '../../', true)}<figcaption>${esc(project.coverLabel)}</figcaption></figure>
          </div>
        </div>
      </section>
      <div class="shell detail">
        <nav class="local-nav" aria-label="페이지 목차">
          <a href="#role">역할</a>${timeline ? '<a href="#timeline">개발 이력</a>' : ''}<a href="#cases">구현 사례</a><a href="#${section.id}">${esc(section.label)}</a>
        </nav>
        ${project.loop ? `<section class="loop" aria-labelledby="loop-title"><h2 id="loop-title">핵심 플레이 루프</h2><ol>${project.loop.map((item) => `<li>${esc(item)}</li>`).join('')}</ol></section>` : ''}
        <section id="role" class="detail-section">
          <p class="eyebrow"><span>ROLE</span> CONTRIBUTION</p>
          <h2>${project.slug === 'battlearena' ? '팀 프로젝트에서 맡은 역할' : '내 역할과 AI의 역할'}</h2>
          <div class="role-grid">${roles.map(([label, text]) => `<div><h3>${esc(label)}</h3><p>${esc(text)}</p></div>`).join('')}</div>
        </section>
        ${timeline ? `<section id="timeline" class="detail-section"><p class="eyebrow"><span>HISTORY</span> ITERATION</p><h2>주요 개발 이력</h2>
          <ol class="timeline">${timeline.map(([version, title, text]) => `<li><span>${esc(version)}</span><div><h3>${esc(title)}</h3><p>${esc(text)}</p></div></li>`).join('')}</ol></section>` : ''}
        <section id="cases" class="detail-section">
          <p class="eyebrow"><span>CASES</span> IMPLEMENTATION</p><h2>구현 사례</h2>
          <div class="case-list">${cases.map(renderCase).join('')}</div>
        </section>
        <section id="${section.id}" class="detail-section">
          <p class="eyebrow"><span>NOTES</span> ${esc(section.label)}</p><h2>${esc(section.title)}</h2>
          <p class="prose">${esc(section.text)}</p>
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
