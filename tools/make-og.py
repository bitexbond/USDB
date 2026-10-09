#!/usr/bin/env python3
"""
生成 Open Graph 图片（1200×630 PNG），输出到 public/og/。

    python3 tools/make-og.py

这是构建期之外的一次性工具：OG 图片随仓库提交，因此普通构建不需要 Python 或 PIL。
只有在改文案、换品牌色时才需要重跑。

为什么用 PIL 而不是 SVG：主流社交爬虫只认 PNG/JPEG，仓库里又没有可靠的
SVG 光栅化工具链（rsvg-convert 未安装，ImageMagick 只能退回到精度较差的
内置 MSVG 渲染器）。直接用 PIL 画反而最可控。
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("需要 Pillow：pip install pillow")

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "og"

W, H = 1200, 630
BG = (8, 11, 17)
BG_ELEV = (15, 20, 29)
GOLD = (220, 174, 95)
GOLD_SOFT = (240, 207, 149)
FG = (215, 222, 233)
FG_MUTED = (143, 156, 176)
LINE = (35, 44, 59)

# 按优先级探测；换机器时只需保证列表里有一个可用
LATIN_BOLD = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
]
LATIN_REG = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
]
CJK_BOLD = [
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc",
]
CJK_REG = [
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
    "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc",
]


def pick(candidates):
    for p in candidates:
        if os.path.exists(p):
            return p
    return None


CJK_OK = pick(CJK_BOLD) is not None and pick(CJK_REG) is not None


def font(size, bold=True, cjk=False):
    if cjk:
        path = pick(CJK_BOLD if bold else CJK_REG) or pick(CJK_BOLD) or pick(CJK_REG)
        if path:
            return ImageFont.truetype(path, size)
        cjk = False
    path = pick(LATIN_BOLD if bold else LATIN_REG)
    if not path:
        sys.exit("找不到可用字体（DejaVu / Liberation / Noto CJK）")
    return ImageFont.truetype(path, size)


def has_cjk(s):
    return any("\u4e00" <= ch <= "\u9fff" for ch in s)


def draw_tracked(draw, xy, text, fnt, fill, tracking=0):
    """逐字绘制以模拟 letter-spacing（PIL 没有原生字距）。"""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + tracking
    return x


def text_width(draw, text, fnt, tracking=0):
    return sum(draw.textlength(ch, font=fnt) for ch in text) + tracking * max(0, len(text) - 1)


def wrap(draw, text, fnt, max_w):
    """按像素宽度折行；中文按字断行，西文按词断行。"""
    if has_cjk(text):
        lines, cur = [], ""
        for ch in text:
            if draw.textlength(cur + ch, font=fnt) <= max_w:
                cur += ch
            else:
                lines.append(cur)
                cur = ch
        if cur:
            lines.append(cur)
        return lines

    words, lines, cur = text.split(), [], ""
    for w in words:
        cand = (cur + " " + w).strip()
        if draw.textlength(cand, font=fnt) <= max_w:
            cur = cand
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def fit(draw, text, sizes, max_w, max_lines, bold, cjk):
    """在给定字号阶梯里挑第一个能满足行数上限的，避免标题被画布裁掉。"""
    for size in sizes:
        f = font(size, bold=bold, cjk=cjk)
        lines = wrap(draw, text, f, max_w)
        if len(lines) <= max_lines:
            return f, lines
    f = font(sizes[-1], bold=bold, cjk=cjk)
    return f, wrap(draw, text, f, max_w)[:max_lines]


def glow_layer():
    """小尺寸画好径向渐变再放大，避免 75 万次逐像素循环。"""
    sw, sh = 240, 126
    small = Image.new("L", (sw, sh))
    px = small.load()
    cx, cy = sw * 0.5, -sh * 0.15
    maxd = (sw * 0.62) ** 2 + (sh * 0.9) ** 2
    for y in range(sh):
        for x in range(sw):
            d = ((x - cx) ** 2 + (y - cy) ** 2) / maxd
            px[x, y] = max(0, int(150 * (1 - min(1.0, d)) ** 2.1))
    return small.resize((W, H), Image.BICUBIC)


def make(page):
    img = Image.new("RGB", (W, H), BG)

    # 顶部品牌光晕
    glow = Image.new("RGB", (W, H), GOLD)
    img.paste(glow, (0, 0), glow_layer())
    img = Image.blend(img, Image.new("RGB", (W, H), BG), 0.0)

    d = ImageDraw.Draw(img)

    # 右侧一块微亮的竖条，给画面一点纵深
    d.rectangle([W - 300, 0, W, H], fill=BG_ELEV)
    d.rectangle([W - 302, 0, W - 300, H], fill=LINE)

    # 顶部金色发丝线
    d.rectangle([0, 0, W, 4], fill=GOLD)

    pad = 84
    content_w = W - pad * 2 - 300

    # 品牌标记
    mark_size, mark_y = 56, 74
    d.rounded_rectangle([pad, mark_y, pad + mark_size, mark_y + mark_size], radius=13, fill=GOLD)
    mf = font(34, bold=True)
    mw = d.textlength("U", font=mf)
    d.text((pad + (mark_size - mw) / 2, mark_y + 6), "U", font=mf, fill=(26, 18, 6))

    # 品牌字标
    wf = font(24, bold=True)
    d.text((pad + mark_size + 18, mark_y + 6), "USDBOND", font=wf, fill=FG)
    sf = font(14, bold=False)
    d.text((pad + mark_size + 18, mark_y + 36), "USDB · ON-CHAIN STABLE EQUITY", font=sf, fill=FG_MUTED)

    # 语言角标
    badge = "中文" if page["locale"] == "zh" and CJK_OK else page["locale"].upper()
    bf = font(15, bold=True)
    bw = text_width(d, badge, bf, 1.5)
    bx = W - pad - bw
    d.rounded_rectangle([bx - 16, mark_y + 14, bx + bw + 16, mark_y + 50], radius=18, outline=LINE, width=1)
    draw_tracked(d, (bx, mark_y + 22), badge, bf, GOLD, 1.5)

    # eyebrow
    y = 190
    ef = font(17, bold=True)
    draw_tracked(d, (pad, y), page["eyebrow"], ef, GOLD, 2.6)
    y += 40

    # headline —— 逐级缩字号直到 2 行内放得下
    cjk_head = has_cjk(page["headline"])
    hf, h_lines = fit(d, page["headline"], [62, 58, 54, 48, 44, 40], content_w, 2, True, cjk_head)
    line_h = int(hf.size * (1.22 if cjk_head else 1.16))
    for ln in h_lines:
        d.text((pad, y), ln, font=hf, fill=(244, 247, 251))
        y += line_h

    # headline 与副文之间的金色短线
    y += 14
    d.rectangle([pad, y, pad + 68, y + 3], fill=GOLD)
    y += 30

    # 副文
    cjk_sub = has_cjk(page["sub"])
    subf, s_lines = fit(d, page["sub"], [26, 24, 22, 20, 18], content_w, 2, False, cjk_sub)
    for ln in s_lines:
        d.text((pad, y), ln, font=subf, fill=FG_MUTED)
        y += int(subf.size * 1.55)

    # 底部站点标识
    baf = font(20, bold=False)
    d.text((pad, H - 74), page["footer"], font=baf, fill=FG_MUTED)
    d.rectangle([pad, H - 96, W - pad, H - 95], fill=LINE)

    img.save(OUT / f"{page['locale']}-{page['slug']}.png", "PNG", optimize=True)
    return y



PAGES = {
    "index": {
        "zh": ("USDBOND · USDB", "链上稳定股票", "$1.00 恒定 NAV · 全年 365 天每日空投美国国债收益"),
        "en": ("USDBOND · USDB", "On-Chain Stable Equity", "$1.00 constant NAV · Treasury yield airdropped 365 days a year"),
    },
    "whitepaper": {
        "zh": ("白皮书 · 版本 1.2", "USDBOND 白皮书", "1940 Act 注册份额 · Rule 2a-7 · 每日空投 · 合规与风险"),
        "en": ("WHITEPAPER · VERSION 1.2", "The USDBOND Whitepaper", "1940 Act shares · Rule 2a-7 · daily airdrop · compliance · risks"),
    },
    "yield": {
        "zh": ("收益机制", "全年 365 天每日空投国债收益", "无需质押 · 无需锁定 · 无需主动领取"),
        "en": ("YIELD MECHANICS", "Treasury Yield, Every Single Day", "No staking · no lock-up · no manual claiming"),
    },
    "comparison": {
        "zh": ("商业对比", "USDB vs USDT vs USDC", "国债利息归发行方，还是归持有人？"),
        "en": ("COMPARISON", "USDB vs USDT vs USDC", "Who keeps the Treasury interest — the issuer, or you?"),
    },
    "compliance": {
        "zh": ("合规架构", "USDB 为什么不是支付稳定币", "1940 Act 注册份额 · KYC/AML 白名单 · 转让限制"),
        "en": ("COMPLIANCE", "Why USDB Is Not a Payment Stablecoin", "1940 Act shares · KYC/AML whitelisting · transfer restrictions"),
    },
    "risks": {
        "zh": ("风险因素", "可能出什么问题", "监管定性 · 流动性错配 · $1 锚定局限 · 智能合约 · 税务"),
        "en": ("RISK FACTORS", "What Can Go Wrong", "Reclassification · liquidity mismatch · peg limits · smart contracts · tax"),
    },
    "faq": {
        "zh": ("常见问题", "27 个高频问题", "定义 · 收益 · 资格 · 合规 · 赎回 · 税务"),
        "en": ("FAQ", "27 Questions, Answered", "Definition · yield · eligibility · compliance · redemption · tax"),
    },
}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    if not CJK_OK:
        print("⚠  未找到中文字体，中文 OG 图会退化为英文排版")

    footer = os.environ.get("SITE_URL", "usdbond.example").replace("https://", "").replace("http://", "").rstrip("/")

    n = 0
    overflows = []
    for slug, langs in PAGES.items():
        for locale, (eyebrow, headline, sub) in langs.items():
            bottom = make(
                {
                    "slug": slug,
                    "locale": locale,
                    "eyebrow": eyebrow,
                    "headline": headline,
                    "sub": sub,
                    "footer": footer,
                }
            )
            # 内容底边必须留在底部横线以上，否则文字会压到页脚
            if bottom > H - 120:
                overflows.append((f"{locale}-{slug}", bottom))
            n += 1

    print(f"✓ 生成 {n} 张 OG 图 → {OUT.relative_to(ROOT)}/")
    if overflows:
        for name, bottom in overflows:
            print(f"⚠  {name} 内容底边 {bottom}px 过低（安全上限 {H - 120}px），请精简文案")
        sys.exit(1)


if __name__ == "__main__":
    main()
