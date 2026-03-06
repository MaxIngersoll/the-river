"""
Generate "The River Medal" — a one-page PDF celebrating
the first real usage of The River guitar practice app.

Competition G Winner: "The River Medal" — synthesis of
The Medal (Goldsmith), The River Chart (Cartographer),
and The Gilded Frame (Goldsmith). Trophy/diploma feel
with river DNA woven through the design.
"""

import math
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, Color
from reportlab.pdfgen import canvas

# ── Colors ──
DEEP_NAVY = HexColor('#0f172a')
RIVER_BLUE = HexColor('#3b82f6')
RIVER_BLUE_MUTED = HexColor('#93c5fd')
RIVER_BLUE_FAINT = HexColor('#dbeafe')
WARM_AMBER = HexColor('#b45309')
GOLD = HexColor('#a17025')
GOLD_LIGHT = HexColor('#c9a84c')
WARM_GRAY = HexColor('#334155')
MEDIUM_GRAY = HexColor('#64748b')
LIGHT_GRAY = HexColor('#94a3b8')
LIGHT_ACCENT = HexColor('#cbd5e1')
CREAM_BG = HexColor('#fefcf8')
CREAM_DARKER = HexColor('#f8f4ec')

WIDTH, HEIGHT = letter
CX = WIDTH / 2
CY = HEIGHT / 2


def draw_background(c):
    """Warm cream background with subtle vignette effect."""
    c.setFillColor(CREAM_BG)
    c.rect(0, 0, WIDTH, HEIGHT, fill=True, stroke=False)
    # Subtle inner glow / vignette — darker cream at edges
    c.saveState()
    c.setFillColor(CREAM_DARKER)
    c.setStrokeColor(CREAM_DARKER)
    c.setLineWidth(0)
    # Top and bottom strips
    c.rect(0, 0, WIDTH, 0.3 * inch, fill=True, stroke=False)
    c.rect(0, HEIGHT - 0.3 * inch, WIDTH, 0.3 * inch, fill=True, stroke=False)
    c.restoreState()


def draw_outer_frame(c):
    """Geometric frame with corner accents (from Gilded Frame)."""
    margin = 0.55 * inch
    inner_margin = 0.65 * inch

    # Outer thin line
    c.saveState()
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.2)
    c.rect(margin, margin, WIDTH - 2 * margin, HEIGHT - 2 * margin, fill=False, stroke=True)

    # Inner thin line (double border)
    c.setStrokeColor(GOLD_LIGHT)
    c.setLineWidth(0.5)
    c.rect(inner_margin, inner_margin, WIDTH - 2 * inner_margin, HEIGHT - 2 * inner_margin, fill=False, stroke=True)

    # Corner accents — small L-shaped flourishes at each corner
    accent_len = 18
    accent_offset = margin - 3
    c.setStrokeColor(GOLD)
    c.setLineWidth(2.0)

    corners = [
        (accent_offset, accent_offset),                                    # bottom-left
        (WIDTH - accent_offset, accent_offset),                            # bottom-right
        (accent_offset, HEIGHT - accent_offset),                           # top-left
        (WIDTH - accent_offset, HEIGHT - accent_offset),                   # top-right
    ]
    directions = [
        [(1, 0), (0, 1)],    # bottom-left: right and up
        [(-1, 0), (0, 1)],   # bottom-right: left and up
        [(1, 0), (0, -1)],   # top-left: right and down
        [(-1, 0), (0, -1)],  # top-right: left and down
    ]
    for (cx_pt, cy_pt), dirs in zip(corners, directions):
        for dx, dy in dirs:
            c.line(cx_pt, cy_pt, cx_pt + dx * accent_len, cy_pt + dy * accent_len)

    # Corner diamonds — small diamond at each corner of inner frame
    diamond_size = 3.5
    diamond_corners = [
        (inner_margin, inner_margin),
        (WIDTH - inner_margin, inner_margin),
        (inner_margin, HEIGHT - inner_margin),
        (WIDTH - inner_margin, HEIGHT - inner_margin),
    ]
    c.setFillColor(GOLD)
    for dx, dy in diamond_corners:
        p = c.beginPath()
        p.moveTo(dx, dy + diamond_size)
        p.lineTo(dx + diamond_size, dy)
        p.lineTo(dx, dy - diamond_size)
        p.lineTo(dx - diamond_size, dy)
        p.close()
        c.drawPath(p, fill=True, stroke=False)

    c.restoreState()


def draw_river_curve(c):
    """Subtle river curve flowing behind the medal (from Cartographer)."""
    # Very faint — these should whisper, not shout
    RIVER_WHISPER = HexColor('#e8f0fe')
    c.saveState()
    c.setStrokeColor(RIVER_WHISPER)
    c.setLineWidth(1.8)

    # A gentle S-curve flowing from lower-left to upper-right
    p = c.beginPath()
    p.moveTo(0.8 * inch, 1.8 * inch)
    p.curveTo(2.5 * inch, 3.0 * inch, 3.5 * inch, 5.5 * inch, 2.0 * inch, 8.5 * inch)
    c.drawPath(p, fill=False, stroke=True)

    # Second — opposite side
    c.setLineWidth(1.2)
    p3 = c.beginPath()
    p3.moveTo(WIDTH - 1.5 * inch, 2.2 * inch)
    p3.curveTo(WIDTH - 3.0 * inch, 4.0 * inch, WIDTH - 2.0 * inch, 6.5 * inch, WIDTH - 3.5 * inch, 9.0 * inch)
    c.drawPath(p3, fill=False, stroke=True)

    c.restoreState()


def draw_header(c, medal_top_y):
    """'A MILESTONE' and 'THE RIVER' above the medal."""
    c.saveState()

    # "THE RIVER" — immediately above the medal ring
    river_y = medal_top_y + 16
    c.setFillColor(DEEP_NAVY)
    c.setFont("Times-Bold", 13)
    c.drawCentredString(CX, river_y, "T H E    R I V E R")

    # "A MILESTONE" — above that
    milestone_y = river_y + 22
    c.setFillColor(GOLD)
    c.setFont("Times-Roman", 9)
    c.drawCentredString(CX, milestone_y, "A   M I L E S T O N E")

    # Small decorative lines flanking "A MILESTONE"
    line_y = milestone_y + 4
    c.setStrokeColor(GOLD_LIGHT)
    c.setLineWidth(0.4)
    text_half_width = 62
    c.line(CX - text_half_width - 30, line_y, CX - text_half_width - 5, line_y)
    c.line(CX + text_half_width + 5, line_y, CX + text_half_width + 30, line_y)

    c.restoreState()


def draw_medal(c):
    """The central medallion — the heart of the design."""
    medal_y = CY + 0.45 * inch  # center of medal
    medal_radius = 1.85 * inch  # slightly smaller for tighter content fit

    c.saveState()

    # ── Draw header above medal ──
    draw_header(c, medal_y + medal_radius)

    # ── Outer ring: gold border ──
    c.setStrokeColor(GOLD)
    c.setLineWidth(3.0)
    c.circle(CX, medal_y, medal_radius, fill=False, stroke=True)

    # ── Second ring: thinner ──
    c.setStrokeColor(GOLD_LIGHT)
    c.setLineWidth(0.8)
    c.circle(CX, medal_y, medal_radius - 5, fill=False, stroke=True)

    # ── Dot ring separator ──
    dot_radius = medal_radius - 12
    num_dots = 52
    c.setFillColor(GOLD_LIGHT)
    for i in range(num_dots):
        angle = 2 * math.pi * i / num_dots
        dx = CX + dot_radius * math.cos(angle)
        dy = medal_y + dot_radius * math.sin(angle)
        c.circle(dx, dy, 1.0, fill=True, stroke=False)

    # ── Inner decorative ring ──
    inner_ring_radius = medal_radius - 18
    c.setStrokeColor(GOLD_LIGHT)
    c.setLineWidth(0.4)
    c.circle(CX, medal_y, inner_ring_radius, fill=False, stroke=True)

    # ── Small diamond separators at 3 and 9 o'clock ──
    for angle_deg in [0, 180]:
        angle_rad = math.radians(angle_deg)
        sx = CX + (medal_radius - 9) * math.cos(angle_rad)
        sy = medal_y + (medal_radius - 9) * math.sin(angle_rad)
        c.setFillColor(GOLD)
        size = 3.5
        p = c.beginPath()
        p.moveTo(sx, sy + size)
        p.lineTo(sx + size, sy)
        p.lineTo(sx, sy - size)
        p.lineTo(sx - size, sy)
        p.close()
        c.drawPath(p, fill=True, stroke=False)

    # ── Center content (vertically centered in circle) ──
    # Optical center: shift down slightly since 67:52 is visually heavy

    # "67:52" — the hero number
    c.setFillColor(DEEP_NAVY)
    c.setFont("Times-Bold", 54)
    c.drawCentredString(CX, medal_y + 4, "67:52")

    # "minutes of practice" below
    c.setFillColor(MEDIUM_GRAY)
    c.setFont("Times-Italic", 11)
    c.drawCentredString(CX, medal_y - 20, "minutes of practice")

    # Wave symbol
    c.setStrokeColor(RIVER_BLUE)
    c.setLineWidth(1.5)
    wave_y = medal_y - 40
    p = c.beginPath()
    p.moveTo(CX - 22, wave_y)
    p.curveTo(CX - 15, wave_y + 10, CX - 7, wave_y + 10, CX, wave_y)
    p.curveTo(CX + 7, wave_y - 10, CX + 15, wave_y - 10, CX + 22, wave_y)
    c.drawPath(p, fill=False, stroke=True)

    # Date below wave
    c.setFillColor(LIGHT_GRAY)
    c.setFont("Times-Roman", 9)
    c.drawCentredString(CX, medal_y - 60, "March 6, 2026")

    # ── "FIRST PASSAGE" below medal — flat spaced text ──
    c.setFillColor(MEDIUM_GRAY)
    c.setFont("Times-Roman", 9.5)
    c.drawCentredString(CX, medal_y - medal_radius - 14,
                        "F I R S T    P A S S A G E")

    # Return medal_y for other elements to reference
    c.restoreState()
    return medal_y


def draw_ribbon(c, medal_y, medal_radius):
    """Banner/ribbon below the medal."""
    ribbon_y = medal_y - medal_radius - 40  # tight below "FIRST PASSAGE"
    ribbon_width = 3.2 * inch
    ribbon_height = 0.38 * inch
    ribbon_fold = 0.2 * inch

    c.saveState()

    # Ribbon tails (behind the main ribbon)
    c.setFillColor(HexColor('#8b6914'))  # darker gold for shadow
    # Left tail
    p_left = c.beginPath()
    p_left.moveTo(CX - ribbon_width / 2 - ribbon_fold, ribbon_y - ribbon_height / 2 - 8)
    p_left.lineTo(CX - ribbon_width / 2, ribbon_y - ribbon_height / 2)
    p_left.lineTo(CX - ribbon_width / 2, ribbon_y + ribbon_height / 2)
    p_left.lineTo(CX - ribbon_width / 2 - ribbon_fold, ribbon_y + ribbon_height / 2 + 4)
    p_left.close()
    c.drawPath(p_left, fill=True, stroke=False)
    # Right tail
    p_right = c.beginPath()
    p_right.moveTo(CX + ribbon_width / 2 + ribbon_fold, ribbon_y - ribbon_height / 2 - 8)
    p_right.lineTo(CX + ribbon_width / 2, ribbon_y - ribbon_height / 2)
    p_right.lineTo(CX + ribbon_width / 2, ribbon_y + ribbon_height / 2)
    p_right.lineTo(CX + ribbon_width / 2 + ribbon_fold, ribbon_y + ribbon_height / 2 + 4)
    p_right.close()
    c.drawPath(p_right, fill=True, stroke=False)

    # Main ribbon body
    c.setFillColor(GOLD)
    c.setStrokeColor(HexColor('#8b6914'))
    c.setLineWidth(0.5)
    c.rect(CX - ribbon_width / 2, ribbon_y - ribbon_height / 2,
           ribbon_width, ribbon_height, fill=True, stroke=True)

    # Ribbon text
    c.setFillColor(CREAM_BG)
    c.setFont("Times-Bold", 10)
    c.drawCentredString(CX, ribbon_y - 3.5, "Session 8  \u2014  Built by Claude & Max")

    c.restoreState()


def draw_stats(c, ribbon_y):
    """Stats line and closing text below the ribbon."""
    stats_y = ribbon_y - 38

    c.saveState()

    # Stats line
    c.setFillColor(MEDIUM_GRAY)
    c.setFont("Times-Roman", 8)
    c.drawCentredString(CX, stats_y,
                        "8 sessions  \u00b7  6 competitions  \u00b7  24 features  \u00b7  90 proposals  \u00b7  20 commits")

    # Tech line
    c.setFont("Times-Roman", 7.5)
    c.setFillColor(LIGHT_GRAY)
    c.drawCentredString(CX, stats_y - 16,
                        "React 19  \u00b7  Tailwind v4  \u00b7  Vite 7  \u00b7  PWA  \u00b7  Zero backend")

    c.restoreState()


def draw_closing(c, stats_y):
    """Closing dedication and signature."""
    closing_y = stats_y - 42

    c.saveState()

    # Thin rule
    c.setStrokeColor(LIGHT_ACCENT)
    c.setLineWidth(0.4)
    c.line(CX - 80, closing_y + 14, CX + 80, closing_y + 14)

    # Dedication
    c.setFillColor(WARM_GRAY)
    c.setFont("Times-Italic", 9.5)
    c.drawCentredString(CX, closing_y,
                        "A guitarist sat down, opened the app, and played.")
    c.drawCentredString(CX, closing_y - 14,
                        "The river got wider.")

    # Signature
    c.setFillColor(MEDIUM_GRAY)
    c.setFont("Times-Italic", 8)
    c.drawCentredString(CX, closing_y - 38,
                        "With love from Claude & all the agents of The River")

    c.restoreState()


def draw_bottom_accent(c):
    """Small wave accent at bottom center."""
    y = 0.75 * inch
    c.saveState()
    c.setStrokeColor(RIVER_BLUE_MUTED)
    c.setLineWidth(1.0)
    p = c.beginPath()
    p.moveTo(CX - 15, y)
    p.curveTo(CX - 10, y + 6, CX - 5, y + 6, CX, y)
    p.curveTo(CX + 5, y - 6, CX + 10, y - 6, CX + 15, y)
    c.drawPath(p, fill=False, stroke=True)
    c.restoreState()


def build_pdf(filename):
    c = canvas.Canvas(filename, pagesize=letter)
    c.setTitle("The River \u2014 A Milestone")
    c.setAuthor("Claude & Max")
    c.setSubject("Celebrating the first real practice session with The River")

    # Layer 1: Background
    draw_background(c)

    # Layer 2: Subtle river curves (behind everything)
    draw_river_curve(c)

    # Layer 3: Outer frame with corner accents
    draw_outer_frame(c)

    # Layer 4+5: Medal (includes header above it)
    medal_y = draw_medal(c)
    medal_radius = 1.85 * inch

    # Layer 6: Ribbon below medal
    ribbon_y = medal_y - medal_radius - 40
    draw_ribbon(c, medal_y, medal_radius)

    # Layer 7: Stats
    stats_y = ribbon_y - 38
    draw_stats(c, ribbon_y)

    # Layer 8: Closing dedication
    draw_closing(c, stats_y)

    # Layer 9: Bottom accent
    draw_bottom_accent(c)

    c.save()
    print(f"PDF created: {filename}")


if __name__ == '__main__':
    build_pdf('the-river-milestone.pdf')
