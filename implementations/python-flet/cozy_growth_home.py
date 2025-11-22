"""
Python Flet Implementation - Cozy Growth Home Screen
Using Flet framework for cross-platform mobile-like UI
Note: Python has limitations compared to native mobile for complex animations,
but Flet provides a good approximation with Material Design components.
"""

import flet as ft
import math
import asyncio
from typing import Optional, Callable
from dataclasses import dataclass
from enum import Enum


# ============================================================================
# Data Models
# ============================================================================

class Duration(Enum):
    SHORT = (5, "5 min")
    MEDIUM = (10, "10 min")
    LONG = (15, "15 min")

    def __init__(self, minutes: int, label: str):
        self.minutes = minutes
        self.label = label


@dataclass
class HomeState:
    """State container for the home screen"""
    sunlight: int = 50
    seeds: int = 120
    minutes_completed: int = 15
    goal_minutes: int = 30
    growth_progress: float = 0.5  # 0-1


# ============================================================================
# Custom Components
# ============================================================================

class GardenScene(ft.UserControl):
    """
    Interactive garden scene with animated elements
    Limitations: Flet doesn't support complex SVG animations like SwiftUI/Compose,
    so we use simpler animations and Canvas drawing
    """

    def __init__(self, sunlight: int, growth_progress: float):
        super().__init__()
        self.sunlight = sunlight
        self.growth_progress = growth_progress
        self.cloud_offset = 0
        self.animation_running = False

    def build(self):
        # Create the garden scene container
        self.garden_canvas = ft.Container(
            width=None,
            height=280,
            border_radius=20,
            gradient=ft.LinearGradient(
                begin=ft.alignment.top_center,
                end=ft.alignment.bottom_center,
                colors=["#A8D5E2", "#C8E6F5"],
            ),
            shadow=ft.BoxShadow(
                spread_radius=0,
                blur_radius=10,
                color=ft.colors.with_opacity(0.1, ft.colors.BLACK),
                offset=ft.Offset(0, 5),
            ),
            content=ft.Stack(
                [
                    # Background hills
                    self._build_hills(),
                    # Sun
                    self._build_sun(),
                    # Cloud (will animate)
                    self._build_cloud(),
                    # Tree
                    self._build_tree(),
                    # Plant character
                    self._build_plant_character(),
                    # Flower
                    self._build_flower(),
                    # Watering can
                    self._build_watering_can(),
                ]
            ),
        )

        return ft.Container(
            padding=ft.padding.symmetric(horizontal=20),
            content=self.garden_canvas,
        )

    def _build_hills(self):
        """Create background hills using containers"""
        return ft.Stack(
            [
                ft.Container(
                    width=160,
                    height=160,
                    left=20,
                    top=150,
                    border_radius=80,
                    bgcolor=ft.colors.with_opacity(0.3, "#9BC49D"),
                ),
                ft.Container(
                    width=160,
                    height=160,
                    left=120,
                    top=160,
                    border_radius=80,
                    bgcolor=ft.colors.with_opacity(0.5, "#9BC49D"),
                ),
                ft.Container(
                    width=160,
                    height=160,
                    left=220,
                    top=170,
                    border_radius=80,
                    bgcolor=ft.colors.with_opacity(0.7, "#9BC49D"),
                ),
            ]
        )

    def _build_sun(self):
        """Create sun with glow effect"""
        return ft.Stack(
            [
                # Glow
                ft.Container(
                    width=80,
                    height=80,
                    left=20,
                    top=10,
                    border_radius=40,
                    gradient=ft.RadialGradient(
                        colors=[
                            ft.colors.with_opacity(0.4, ft.colors.YELLOW),
                            ft.colors.TRANSPARENT,
                        ]
                    ),
                ),
                # Sun body
                ft.Container(
                    width=40,
                    height=40,
                    left=40,
                    top=30,
                    border_radius=20,
                    bgcolor="#FFD93D",
                    border=ft.border.all(2, "#FFA500"),
                ),
            ]
        )

    def _build_cloud(self):
        """Create cloud using rounded containers"""
        return ft.Container(
            left=140,
            top=45,
            content=ft.Row(
                spacing=-15,
                controls=[
                    ft.Container(
                        width=25,
                        height=25,
                        border_radius=12.5,
                        bgcolor=ft.colors.WHITE,
                    ),
                    ft.Container(
                        width=35,
                        height=35,
                        border_radius=17.5,
                        bgcolor=ft.colors.WHITE,
                        margin=ft.margin.only(top=-5),
                    ),
                    ft.Container(
                        width=25,
                        height=25,
                        border_radius=12.5,
                        bgcolor=ft.colors.WHITE,
                    ),
                ],
            ),
        )

    def _build_tree(self):
        """Create tree using containers"""
        return ft.Container(
            right=20,
            top=60,
            content=ft.Stack(
                [
                    # Trunk
                    ft.Container(
                        width=15,
                        height=40,
                        left=42.5,
                        top=40,
                        border_radius=5,
                        bgcolor="#8B5A3C",
                    ),
                    # Foliage (3 circles)
                    ft.Container(
                        width=60,
                        height=60,
                        left=20,
                        top=15,
                        border_radius=30,
                        bgcolor="#6B9B3D",
                    ),
                    ft.Container(
                        width=55,
                        height=55,
                        left=50,
                        top=20,
                        border_radius=27.5,
                        bgcolor="#7BA05B",
                    ),
                    ft.Container(
                        width=50,
                        height=50,
                        left=35,
                        top=10,
                        border_radius=25,
                        bgcolor="#6B9B3D",
                    ),
                ]
            ),
        )

    def _build_plant_character(self):
        """
        Create kawaii plant character
        Simplified version - in production, use SVG or custom drawing
        """
        return ft.Container(
            left=120,
            top=170,
            content=ft.Stack(
                [
                    # Body (approximated with container)
                    ft.Container(
                        width=65,
                        height=75,
                        border_radius=32.5,
                        gradient=ft.LinearGradient(
                            begin=ft.alignment.top_center,
                            end=ft.alignment.bottom_center,
                            colors=["#A8D672", "#C5E89B"],
                        ),
                    ),
                    # Face elements (simplified)
                    ft.Container(
                        left=18,
                        top=25,
                        content=ft.Row(
                            spacing=18,
                            controls=[
                                # Eyes
                                ft.Container(
                                    width=8,
                                    height=8,
                                    border_radius=4,
                                    bgcolor="#3D2817",
                                ),
                                ft.Container(
                                    width=8,
                                    height=8,
                                    border_radius=4,
                                    bgcolor="#3D2817",
                                ),
                            ],
                        ),
                    ),
                    # Smile (approximated with text)
                    ft.Container(
                        left=22,
                        top=35,
                        content=ft.Text("︶", size=20, color="#3D2817"),
                    ),
                ]
            ),
        )

    def _build_flower(self):
        """Create growing flower"""
        stem_height = 40 * self.growth_progress

        flower_components = [
            # Stem
            ft.Container(
                width=4,
                height=stem_height,
                left=28,
                top=40,
                bgcolor="#6B9B3D",
            ),
        ]

        # Flower head (appears when progress > 30%)
        if self.growth_progress > 0.3:
            flower_scale = min(1.0, (self.growth_progress - 0.3) / 0.7)

            # Simplified flower (text emoji for simplicity)
            flower_components.append(
                ft.Container(
                    left=15,
                    top=10,
                    content=ft.Text(
                        "🌸",
                        size=30 * flower_scale,
                    ),
                )
            )

        return ft.Container(
            left=240,
            top=160,
            width=60,
            height=80,
            content=ft.Stack(flower_components),
        )

    def _build_watering_can(self):
        """Create watering can (simplified)"""
        return ft.Container(
            left=80,
            top=220,
            content=ft.Text("🚿", size=30),  # Using emoji for simplicity
        )


class ProgressIndicator(ft.UserControl):
    """Animated progress bar"""

    def __init__(self, current: int, goal: int):
        super().__init__()
        self.current = current
        self.goal = goal
        self.progress = current / goal if goal > 0 else 0

    def build(self):
        return ft.Container(
            padding=ft.padding.symmetric(horizontal=20, vertical=16),
            content=ft.Column(
                horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                spacing=8,
                controls=[
                    ft.Text(
                        f"{self.current}/{self.goal} Minutes of Growth",
                        size=14,
                        weight=ft.FontWeight.W_500,
                        color="#6B5D4F",
                    ),
                    ft.Container(
                        width=None,
                        height=8,
                        border_radius=10,
                        bgcolor="#E8E4DC",
                        content=ft.Container(
                            width=None,  # Will be controlled by column flex
                            height=8,
                            border_radius=10,
                            bgcolor="#7BA05B",
                            # Simulate progress with width percentage
                            expand=False,
                        ),
                    ),
                ],
            ),
        )


class CurrencyBar(ft.UserControl):
    """Display sunlight and seeds currency"""

    def __init__(self, sunlight: int, seeds: int):
        super().__init__()
        self.sunlight = sunlight
        self.seeds = seeds

    def build(self):
        return ft.Container(
            padding=ft.padding.symmetric(horizontal=20, vertical=8),
            content=ft.Container(
                padding=ft.padding.symmetric(horizontal=20, vertical=12),
                border_radius=20,
                bgcolor=ft.colors.with_opacity(0.9, ft.colors.WHITE),
                shadow=ft.BoxShadow(
                    spread_radius=0,
                    blur_radius=5,
                    color=ft.colors.with_opacity(0.05, ft.colors.BLACK),
                    offset=ft.Offset(0, 2),
                ),
                content=ft.Row(
                    alignment=ft.MainAxisAlignment.CENTER,
                    spacing=24,
                    controls=[
                        # Sunlight
                        ft.Row(
                            spacing=6,
                            controls=[
                                ft.Container(
                                    width=30,
                                    height=30,
                                    border_radius=15,
                                    bgcolor=ft.colors.with_opacity(0.2, ft.colors.YELLOW),
                                    content=ft.Text("☀️", size=18),
                                    alignment=ft.alignment.center,
                                ),
                                ft.Text(
                                    f"Sunlight: {self.sunlight}",
                                    size=15,
                                    weight=ft.FontWeight.W_600,
                                    color="#3D2817",
                                ),
                            ],
                        ),
                        # Separator
                        ft.Container(
                            width=1,
                            height=20,
                            bgcolor="#D4CFC7",
                        ),
                        # Seeds
                        ft.Row(
                            spacing=6,
                            controls=[
                                ft.Text("🌰", size=18),
                                ft.Text(
                                    f"Seeds: {self.seeds}",
                                    size=15,
                                    weight=ft.FontWeight.W_600,
                                    color="#3D2817",
                                ),
                            ],
                        ),
                    ],
                ),
            ),
        )


class SeedPacket(ft.UserControl):
    """Seed packet selector button"""

    def __init__(
        self,
        duration: Duration,
        is_selected: bool,
        on_select: Callable[[Duration], None],
    ):
        super().__init__()
        self.duration = duration
        self.is_selected = is_selected
        self.on_select = on_select

    def build(self):
        # Colors based on duration
        colors_map = {
            Duration.SHORT: (["#F5DEB3", "#D2B48C"], "#8B7355"),
            Duration.MEDIUM: (["#C8E6A0", "#A8D672"], "#6B9B3D"),
            Duration.LONG: (["#FFB6A0", "#FF9B85"], "#C19A6B"),
        }

        gradient_colors, border_color = colors_map[self.duration]

        return ft.GestureDetector(
            on_tap=lambda _: self.on_select(self.duration),
            content=ft.Column(
                horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                spacing=8,
                controls=[
                    # Seed packet
                    ft.Container(
                        width=60,
                        height=70,
                        border_radius=8,
                        gradient=ft.LinearGradient(
                            begin=ft.alignment.top_center,
                            end=ft.alignment.bottom_center,
                            colors=gradient_colors,
                        ),
                        border=ft.border.all(
                            width=3 if self.is_selected else 1.5,
                            color=border_color,
                        ),
                        shadow=ft.BoxShadow(
                            spread_radius=0,
                            blur_radius=5 if self.is_selected else 0,
                            color=ft.colors.with_opacity(0.15, ft.colors.BLACK),
                            offset=ft.Offset(0, 3),
                        ) if self.is_selected else None,
                        # Seeds illustration (simplified)
                        content=ft.Column(
                            alignment=ft.MainAxisAlignment.CENTER,
                            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                            spacing=4,
                            controls=[
                                ft.Row(
                                    spacing=3,
                                    alignment=ft.MainAxisAlignment.CENTER,
                                    controls=[
                                        ft.Container(
                                            width=8,
                                            height=8,
                                            border_radius=4,
                                            bgcolor="#5C4033",
                                        ),
                                        ft.Container(
                                            width=8,
                                            height=8,
                                            border_radius=4,
                                            bgcolor="#5C4033",
                                        ),
                                    ],
                                ),
                                ft.Container(
                                    width=8,
                                    height=8,
                                    border_radius=4,
                                    bgcolor="#5C4033",
                                ),
                            ],
                        ),
                    ),
                    # Label
                    ft.Text(
                        self.duration.label,
                        size=13,
                        weight=ft.FontWeight.BOLD if self.is_selected else ft.FontWeight.NORMAL,
                        color="#3D2817" if self.is_selected else "#8B7355",
                    ),
                ],
            ),
        )


class NurturingCard(ft.UserControl):
    """Main action card with duration selector and cultivate button"""

    def __init__(
        self,
        selected_duration: Duration,
        on_duration_select: Callable[[Duration], None],
        on_cultivate: Callable[[], None],
    ):
        super().__init__()
        self.selected_duration = selected_duration
        self.on_duration_select = on_duration_select
        self.on_cultivate = on_cultivate

    def build(self):
        return ft.Container(
            padding=ft.padding.symmetric(horizontal=20, vertical=0),
            content=ft.Container(
                padding=20,
                border_radius=20,
                bgcolor="#F5E6D3",
                shadow=ft.BoxShadow(
                    spread_radius=0,
                    blur_radius=10,
                    color=ft.colors.with_opacity(0.08, ft.colors.BLACK),
                    offset=ft.Offset(0, 5),
                ),
                content=ft.Column(
                    horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                    spacing=20,
                    controls=[
                        # Title
                        ft.Text(
                            "Nurturing Duration",
                            size=16,
                            weight=ft.FontWeight.W_600,
                            color="#3D2817",
                        ),
                        # Duration selector
                        ft.Row(
                            alignment=ft.MainAxisAlignment.SPACE_BETWEEN,
                            spacing=12,
                            controls=[
                                SeedPacket(
                                    duration=d,
                                    is_selected=self.selected_duration == d,
                                    on_select=self.on_duration_select,
                                )
                                for d in Duration
                            ],
                        ),
                        # Cultivate button (wooden texture)
                        ft.ElevatedButton(
                            content=ft.Row(
                                alignment=ft.MainAxisAlignment.CENTER,
                                spacing=8,
                                controls=[
                                    ft.Text("🌱", size=20),
                                    ft.Text(
                                        "Cultivate One Tiny Step",
                                        size=17,
                                        weight=ft.FontWeight.BOLD,
                                        color=ft.colors.WHITE,
                                    ),
                                ],
                            ),
                            width=None,
                            height=56,
                            style=ft.ButtonStyle(
                                bgcolor="#8B5A3C",
                                shape=ft.RoundedRectangleBorder(radius=25),
                                padding=ft.padding.symmetric(horizontal=20, vertical=18),
                                elevation=8,
                                overlay_color=ft.colors.with_opacity(0.1, ft.colors.BLACK),
                            ),
                            on_click=lambda _: self.on_cultivate(),
                        ),
                    ],
                ),
            ),
        )


# ============================================================================
# Main Screen
# ============================================================================

class CozyGrowthHome(ft.UserControl):
    """Main home screen component"""

    def __init__(self, on_start_session: Optional[Callable[[int], None]] = None):
        super().__init__()
        self.state = HomeState()
        self.selected_duration = Duration.MEDIUM
        self.on_start_session = on_start_session

    def handle_duration_select(self, duration: Duration):
        """Handle seed packet selection"""
        self.selected_duration = duration
        self.update()

    def handle_cultivate(self):
        """Handle cultivate button press"""
        if self.on_start_session:
            self.on_start_session(self.selected_duration.minutes)
        print(f"Starting session: {self.selected_duration.minutes} minutes")

    def build(self):
        return ft.Container(
            gradient=ft.LinearGradient(
                begin=ft.alignment.top_center,
                end=ft.alignment.bottom_center,
                colors=["#FFF9F0", "#F5F8F2"],
            ),
            content=ft.Column(
                scroll=ft.ScrollMode.AUTO,
                spacing=0,
                controls=[
                    ft.Container(height=8),
                    # Garden Scene
                    GardenScene(
                        sunlight=self.state.sunlight,
                        growth_progress=self.state.growth_progress,
                    ),
                    # Progress Indicator
                    ProgressIndicator(
                        current=self.state.minutes_completed,
                        goal=self.state.goal_minutes,
                    ),
                    # Currency Bar
                    CurrencyBar(
                        sunlight=self.state.sunlight,
                        seeds=self.state.seeds,
                    ),
                    ft.Container(height=24),
                    # Nurturing Card
                    NurturingCard(
                        selected_duration=self.selected_duration,
                        on_duration_select=self.handle_duration_select,
                        on_cultivate=self.handle_cultivate,
                    ),
                    ft.Container(height=40),
                ],
            ),
        )


# ============================================================================
# Application Entry Point
# ============================================================================

def main(page: ft.Page):
    """Main application entry point"""
    page.title = "Cozy Growth"
    page.theme_mode = ft.ThemeMode.LIGHT
    page.padding = 0
    page.bgcolor = "#FFF9F0"

    # Configure fonts (optional - use system defaults for simplicity)
    page.fonts = {
        "Rounded": "https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap"
    }
    page.theme = ft.Theme(font_family="Rounded")

    def start_session(duration_minutes: int):
        """Callback when session starts"""
        print(f"Session started: {duration_minutes} minutes")
        # Navigate to timer screen (implement your navigation logic)
        # page.go("/timer")

    # Create and add the home screen
    home_screen = CozyGrowthHome(on_start_session=start_session)
    page.add(home_screen)


if __name__ == "__main__":
    # Run the Flet application
    # For mobile: use ft.app(target=main, view=ft.AppView.FLET_APP)
    ft.app(target=main)


"""
INSTALLATION & USAGE:

1. Install Flet:
   pip install flet

2. Run the application:
   python cozy_growth_home.py

3. For mobile deployment:
   # iOS
   flet build ipa

   # Android
   flet build apk

LIMITATIONS:
- Flet doesn't support complex SVG path animations like SwiftUI/Compose
- Animation capabilities are more limited compared to native frameworks
- Some visual effects (like gradient shadows) are approximated
- Best for prototyping or simple apps; for production consider native frameworks

ADVANTAGES:
- Cross-platform (iOS, Android, Web, Desktop) from single codebase
- Rapid prototyping with Python
- Good for MVPs and internal tools
- Easy to iterate and modify
"""
