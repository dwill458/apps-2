/**
 * iOS SwiftUI Implementation - Cozy Growth Home Screen
 * Pixel-perfect replication with rich animations
 */

import SwiftUI

// MARK: - Main Home View
struct CozyGrowthHomeView: View {
    @StateObject private var viewModel = HomeViewModel()
    @State private var selectedDuration: Duration = .medium
    @State private var isButtonPressed = false

    var body: some View {
        ZStack {
            // Background gradient (soft cream to pale green)
            LinearGradient(
                colors: [
                    Color(hex: "#FFF9F0"),
                    Color(hex: "#F5F8F2")
                ],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(spacing: 16) {
                    // Garden Scene Header
                    GardenSceneView(
                        sunlightAmount: viewModel.sunlight,
                        plantGrowthProgress: viewModel.growthProgress
                    )
                    .frame(height: 280)
                    .padding(.top, 8)

                    // Progress Indicator
                    ProgressIndicatorView(
                        current: viewModel.minutesCompleted,
                        goal: viewModel.goalMinutes
                    )
                    .padding(.horizontal, 20)

                    // Currency Bar
                    CurrencyBarView(
                        sunlight: viewModel.sunlight,
                        seeds: viewModel.seeds
                    )
                    .padding(.horizontal, 20)

                    // Nurturing Duration Card
                    NurturingCardView(
                        selectedDuration: $selectedDuration,
                        onCultivate: handleCultivate
                    )
                    .padding(.horizontal, 20)

                    Spacer(minLength: 40)
                }
            }
        }
    }

    private func handleCultivate() {
        // Using easeOutBack spring for playful "pop" feel
        withAnimation(.spring(response: 0.3, dampingFraction: 0.6, blendDuration: 0)) {
            isButtonPressed = true
        }

        // Haptic feedback
        let generator = UIImpactFeedbackGenerator(style: .medium)
        generator.impactOccurred()

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            withAnimation(.spring(response: 0.2, dampingFraction: 0.7)) {
                isButtonPressed = false
            }
            viewModel.startSession(duration: selectedDuration.minutes)
        }
    }
}

// MARK: - Garden Scene
struct GardenSceneView: View {
    let sunlightAmount: Int
    let plantGrowthProgress: CGFloat

    @State private var cloudOffset: CGFloat = 0
    @State private var flowerSway: Double = 0
    @State private var characterBreath: CGFloat = 1.0
    @State private var sunRotation: Double = 0

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Sky gradient background
                LinearGradient(
                    colors: [
                        Color(hex: "#A8D5E2"),
                        Color(hex: "#C8E6F5")
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .cornerRadius(20)

                // Background hills (parallax layers)
                HStack(spacing: 0) {
                    ForEach(0..<3, id: \.self) { index in
                        RoundedRectangle(cornerRadius: 100)
                            .fill(Color(hex: "#9BC49D"))
                            .frame(width: geometry.size.width / 2, height: 60)
                            .offset(y: 80 + CGFloat(index) * 10)
                            .opacity(0.3 + Double(index) * 0.2)
                    }
                }

                // Tree (top right)
                TreeView()
                    .frame(width: 100, height: 120)
                    .position(x: geometry.size.width * 0.85, y: 60)

                // Sun with glow
                ZStack {
                    // Glow effect
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [
                                    Color.yellow.opacity(0.4),
                                    Color.clear
                                ],
                                center: .center,
                                startRadius: 20,
                                endRadius: 40
                            )
                        )
                        .frame(width: 80, height: 80)

                    // Sun body
                    Circle()
                        .fill(Color(hex: "#FFD93D"))
                        .frame(width: 40, height: 40)
                        .overlay(
                            Circle()
                                .stroke(Color(hex: "#FFA500"), lineWidth: 2)
                        )
                        .rotationEffect(.degrees(sunRotation))
                }
                .position(x: 60, y: 50)
                .onAppear {
                    // Subtle sun rotation for alive feeling
                    withAnimation(.linear(duration: 60).repeatForever(autoreverses: false)) {
                        sunRotation = 360
                    }
                }

                // Cloud (floating animation)
                CloudView()
                    .frame(width: 70, height: 30)
                    .position(x: 140 + cloudOffset, y: 45)
                    .onAppear {
                        // Using easeInOut for smooth, natural cloud drift
                        withAnimation(.easeInOut(duration: 8).repeatForever(autoreverses: true)) {
                            cloudOffset = 40
                        }
                    }

                // Kawaii Plant Character (Sprout)
                PlantCharacterView(breathScale: characterBreath)
                    .frame(width: 100, height: 120)
                    .position(x: geometry.size.width * 0.35, y: geometry.size.height * 0.7)
                    .onAppear {
                        // Breathing animation - easeInOut for natural rhythm
                        withAnimation(.easeInOut(duration: 2).repeatForever(autoreverses: true)) {
                            characterBreath = 1.03
                        }
                    }

                // Growing Flower (sways gently)
                FlowerView(progress: plantGrowthProgress)
                    .frame(width: 60, height: 80)
                    .rotationEffect(.degrees(flowerSway), anchor: .bottom)
                    .position(x: geometry.size.width * 0.65, y: geometry.size.height * 0.65)
                    .onAppear {
                        // Swaying animation - easeInOut for gentle, realistic movement
                        withAnimation(.easeInOut(duration: 3).repeatForever(autoreverses: true)) {
                            flowerSway = 5
                        }
                    }

                // Watering can (accessory)
                WateringCanView()
                    .frame(width: 40, height: 40)
                    .position(x: geometry.size.width * 0.25, y: geometry.size.height * 0.85)
            }
            .clipped()
        }
        .shadow(color: .black.opacity(0.1), radius: 10, y: 5)
    }
}

// MARK: - Plant Character (Kawaii Sprout)
struct PlantCharacterView: View {
    let breathScale: CGFloat

    var body: some View {
        ZStack {
            // Body (pear-shaped)
            RoundedRectangle(cornerRadius: 40)
                .fill(
                    LinearGradient(
                        colors: [
                            Color(hex: "#A8D672"),
                            Color(hex: "#C5E89B")
                        ],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .frame(width: 65, height: 75)
                .scaleEffect(x: 1.0, y: breathScale, anchor: .bottom)

            // Leaves on head
            HStack(spacing: -10) {
                LeafShape()
                    .fill(Color(hex: "#6B9B3D"))
                    .frame(width: 25, height: 30)
                    .rotationEffect(.degrees(-20))

                LeafShape()
                    .fill(Color(hex: "#6B9B3D"))
                    .frame(width: 25, height: 30)
                    .rotationEffect(.degrees(20))
            }
            .offset(y: -40)

            // Face
            VStack(spacing: 8) {
                // Eyes (kawaii style - simple dots)
                HStack(spacing: 18) {
                    Circle()
                        .fill(Color(hex: "#3D2817"))
                        .frame(width: 8, height: 8)

                    Circle()
                        .fill(Color(hex: "#3D2817"))
                        .frame(width: 8, height: 8)
                }

                // Smile (curved line)
                Arc(startAngle: .degrees(0), endAngle: .degrees(180))
                    .stroke(Color(hex: "#3D2817"), lineWidth: 2)
                    .frame(width: 20, height: 10)
            }
            .offset(y: -5)

            // Rosy cheeks
            HStack(spacing: 40) {
                Circle()
                    .fill(Color(hex: "#FFB6C1").opacity(0.6))
                    .frame(width: 12, height: 12)

                Circle()
                    .fill(Color(hex: "#FFB6C1").opacity(0.6))
                    .frame(width: 12, height: 12)
            }
            .offset(y: 5)

            // Farmer outfit stripes (overalls)
            VStack(spacing: 6) {
                Rectangle()
                    .fill(Color(hex: "#8B6F47"))
                    .frame(width: 50, height: 3)

                Rectangle()
                    .fill(Color(hex: "#8B6F47"))
                    .frame(width: 50, height: 3)
            }
            .offset(y: 15)

            // Little feet
            HStack(spacing: 20) {
                Capsule()
                    .fill(Color(hex: "#8B5A3C"))
                    .frame(width: 18, height: 10)

                Capsule()
                    .fill(Color(hex: "#8B5A3C"))
                    .frame(width: 18, height: 10)
            }
            .offset(y: 50)
        }
    }
}

// MARK: - Supporting Views
struct CloudView: View {
    var body: some View {
        ZStack {
            HStack(spacing: -15) {
                Circle().fill(Color.white).frame(width: 25, height: 25)
                Circle().fill(Color.white).frame(width: 35, height: 35).offset(y: -5)
                Circle().fill(Color.white).frame(width: 25, height: 25)
            }
        }
        .shadow(color: .black.opacity(0.05), radius: 2, y: 2)
    }
}

struct TreeView: View {
    var body: some View {
        ZStack {
            // Trunk
            RoundedRectangle(cornerRadius: 5)
                .fill(Color(hex: "#8B5A3C"))
                .frame(width: 15, height: 40)
                .offset(y: 20)

            // Foliage (layered circles for depth)
            ZStack {
                Circle().fill(Color(hex: "#6B9B3D")).frame(width: 60, height: 60).offset(x: -10, y: -5)
                Circle().fill(Color(hex: "#7BA05B")).frame(width: 55, height: 55).offset(x: 10, y: 0)
                Circle().fill(Color(hex: "#6B9B3D")).frame(width: 50, height: 50).offset(y: -10)
            }
            .offset(y: -10)
        }
    }
}

struct FlowerView: View {
    let progress: CGFloat

    var body: some View {
        ZStack {
            // Stem (grows with progress)
            Rectangle()
                .fill(Color(hex: "#6B9B3D"))
                .frame(width: 4, height: 40 * progress)
                .offset(y: 20)

            // Flower head (appears when progress > 30%)
            if progress > 0.3 {
                ZStack {
                    // Petals (5 petals in circle)
                    ForEach(0..<5, id: \.self) { index in
                        Ellipse()
                            .fill(
                                RadialGradient(
                                    colors: [
                                        Color(hex: "#FFB6C1"),
                                        Color(hex: "#FF69B4")
                                    ],
                                    center: .center,
                                    startRadius: 5,
                                    endRadius: 15
                                )
                            )
                            .frame(width: 20, height: 30)
                            .offset(y: -12)
                            .rotationEffect(.degrees(Double(index) * 72))
                    }

                    // Center
                    Circle()
                        .fill(Color(hex: "#FFD93D"))
                        .frame(width: 15, height: 15)
                }
                .offset(y: -20)
                .scaleEffect(min(1.0, (progress - 0.3) / 0.7))
            }
        }
    }
}

struct WateringCanView: View {
    var body: some View {
        ZStack {
            // Can body
            RoundedRectangle(cornerRadius: 5)
                .fill(Color(hex: "#C0C0C0"))
                .frame(width: 25, height: 20)

            // Spout
            Rectangle()
                .fill(Color(hex: "#C0C0C0"))
                .frame(width: 3, height: 12)
                .offset(x: 15, y: -5)
                .rotationEffect(.degrees(-30))

            // Handle
            Circle()
                .stroke(Color(hex: "#C0C0C0"), lineWidth: 3)
                .frame(width: 15, height: 15)
                .offset(x: -15, y: -5)
        }
    }
}

// MARK: - Progress Indicator
struct ProgressIndicatorView: View {
    let current: Int
    let goal: Int

    var progress: CGFloat {
        CGFloat(current) / CGFloat(goal)
    }

    var body: some View {
        VStack(spacing: 8) {
            Text("\(current)/\(goal) Minutes of Growth")
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Color(hex: "#6B5D4F"))

            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    // Background
                    RoundedRectangle(cornerRadius: 10)
                        .fill(Color(hex: "#E8E4DC"))
                        .frame(height: 8)

                    // Progress fill - animated with spring for satisfying feel
                    RoundedRectangle(cornerRadius: 10)
                        .fill(
                            LinearGradient(
                                colors: [
                                    Color(hex: "#7BA05B"),
                                    Color(hex: "#A8D672")
                                ],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: geometry.size.width * progress, height: 8)
                        .animation(.spring(response: 0.5, dampingFraction: 0.7), value: progress)
                }
            }
            .frame(height: 8)
        }
    }
}

// MARK: - Currency Bar
struct CurrencyBarView: View {
    let sunlight: Int
    let seeds: Int

    var body: some View {
        HStack(spacing: 24) {
            // Sunlight
            HStack(spacing: 6) {
                ZStack {
                    Circle()
                        .fill(Color.yellow.opacity(0.2))
                        .frame(width: 30, height: 30)

                    Text("☀️")
                        .font(.system(size: 18))
                }

                Text("Sunlight: \(sunlight)")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(Color(hex: "#3D2817"))
            }

            // Separator
            Rectangle()
                .fill(Color(hex: "#D4CFC7"))
                .frame(width: 1, height: 20)

            // Seeds
            HStack(spacing: 6) {
                Text("🌰")
                    .font(.system(size: 18))

                Text("Seeds: \(seeds)")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(Color(hex: "#3D2817"))
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 12)
        .background(
            RoundedRectangle(cornerRadius: 20)
                .fill(Color.white.opacity(0.9))
                .shadow(color: .black.opacity(0.05), radius: 5, y: 2)
        )
    }
}

// MARK: - Nurturing Card
struct NurturingCardView: View {
    @Binding var selectedDuration: Duration
    let onCultivate: () -> Void

    @State private var seedScales: [Duration: CGFloat] = [:]

    var body: some View {
        VStack(spacing: 20) {
            Text("Nurturing Duration")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "#3D2817"))

            // Seed packet selector
            HStack(spacing: 12) {
                ForEach(Duration.allCases, id: \.self) { duration in
                    SeedPacketView(
                        duration: duration,
                        isSelected: selectedDuration == duration,
                        scale: seedScales[duration] ?? 1.0
                    )
                    .onTapGesture {
                        handleSeedSelection(duration)
                    }
                }
            }

            // Cultivate button (wooden texture)
            Button(action: onCultivate) {
                HStack(spacing: 8) {
                    Text("🌱")
                        .font(.system(size: 20))

                    Text("Cultivate One Tiny Step")
                        .font(.system(size: 17, weight: .bold))
                        .foregroundColor(.white)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 18)
                .background(
                    // Wooden texture gradient
                    LinearGradient(
                        colors: [
                            Color(hex: "#8B5A3C"),
                            Color(hex: "#A0826D"),
                            Color(hex: "#8B5A3C")
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .cornerRadius(25)
                .overlay(
                    RoundedRectangle(cornerRadius: 25)
                        .stroke(Color(hex: "#6B4423"), lineWidth: 2)
                )
                .shadow(color: .black.opacity(0.2), radius: 8, y: 4)
            }
            .buttonStyle(WoodenButtonStyle())
        }
        .padding(20)
        .background(
            RoundedRectangle(cornerRadius: 20)
                .fill(Color(hex: "#F5E6D3"))
                .shadow(color: .black.opacity(0.08), radius: 10, y: 5)
        )
    }

    private func handleSeedSelection(_ duration: Duration) {
        // Haptic feedback
        let generator = UISelectionFeedbackGenerator()
        generator.selectionChanged()

        selectedDuration = duration

        // Bouncy animation - easeOutBack for playful overshoot
        withAnimation(.spring(response: 0.3, dampingFraction: 0.5)) {
            seedScales[duration] = 1.15
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) {
            withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) {
                seedScales[duration] = 1.0
            }
        }
    }
}

// MARK: - Seed Packet View
struct SeedPacketView: View {
    let duration: Duration
    let isSelected: Bool
    let scale: CGFloat

    var body: some View {
        VStack(spacing: 8) {
            // Seed packet illustration
            ZStack {
                // Packet body
                RoundedRectangle(cornerRadius: 8)
                    .fill(
                        LinearGradient(
                            colors: duration.colors,
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                    .frame(width: 60, height: 70)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(duration.borderColor, lineWidth: isSelected ? 3 : 1.5)
                    )

                // Seeds illustration
                VStack(spacing: 4) {
                    HStack(spacing: 3) {
                        Circle().fill(Color(hex: "#5C4033")).frame(width: 8, height: 8)
                        Circle().fill(Color(hex: "#5C4033")).frame(width: 8, height: 8)
                    }
                    Circle().fill(Color(hex: "#5C4033")).frame(width: 8, height: 8)
                }
                .offset(y: -8)
            }
            .scaleEffect(scale)

            Text("\(duration.minutes) min")
                .font(.system(size: 13, weight: isSelected ? .bold : .regular))
                .foregroundColor(isSelected ? Color(hex: "#3D2817") : Color(hex: "#8B7355"))
        }
        .shadow(color: isSelected ? Color.black.opacity(0.15) : Color.clear, radius: 5, y: 3)
    }
}

// MARK: - Wooden Button Style
struct WoodenButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.spring(response: 0.2, dampingFraction: 0.7), value: configuration.isPressed)
    }
}

// MARK: - Supporting Types & Shapes
enum Duration: CaseIterable {
    case short, medium, long

    var minutes: Int {
        switch self {
        case .short: return 5
        case .medium: return 10
        case .long: return 15
        }
    }

    var colors: [Color] {
        switch self {
        case .short: return [Color(hex: "#F5DEB3"), Color(hex: "#D2B48C")]
        case .medium: return [Color(hex: "#C8E6A0"), Color(hex: "#A8D672")]
        case .long: return [Color(hex: "#FFB6A0"), Color(hex: "#FF9B85")]
        }
    }

    var borderColor: Color {
        switch self {
        case .short: return Color(hex: "#8B7355")
        case .medium: return Color(hex: "#6B9B3D")
        case .long: return Color(hex: "#C19A6B")
        }
    }
}

struct LeafShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.midX, y: rect.minY))
        path.addQuadCurve(
            to: CGPoint(x: rect.midX, y: rect.maxY),
            control: CGPoint(x: rect.maxX, y: rect.midY)
        )
        path.addQuadCurve(
            to: CGPoint(x: rect.midX, y: rect.minY),
            control: CGPoint(x: rect.minX, y: rect.midY)
        )
        return path
    }
}

struct Arc: Shape {
    let startAngle: Angle
    let endAngle: Angle

    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.addArc(
            center: CGPoint(x: rect.midX, y: rect.minY),
            radius: rect.width / 2,
            startAngle: startAngle,
            endAngle: endAngle,
            clockwise: false
        )
        return path
    }
}

// MARK: - View Model
class HomeViewModel: ObservableObject {
    @Published var sunlight: Int = 50
    @Published var seeds: Int = 120
    @Published var minutesCompleted: Int = 15
    @Published var goalMinutes: Int = 30
    @Published var growthProgress: CGFloat = 0.5

    func startSession(duration: Int) {
        // Navigate to timer screen
        print("Starting session: \(duration) minutes")
    }
}

// MARK: - Color Extension
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let r, g, b: UInt64
        switch hex.count {
        case 6:
            (r, g, b) = ((int >> 16) & 0xFF, (int >> 8) & 0xFF, int & 0xFF)
        default:
            (r, g, b) = (0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255
        )
    }
}
