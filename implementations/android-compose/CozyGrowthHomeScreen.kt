/**
 * Android Jetpack Compose Implementation - Cozy Growth Home Screen
 * Pixel-perfect replication with high-performance animations
 */

package com.cozygrowth.home

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.cos
import kotlin.math.sin

// MARK: - Main Composable
@Composable
fun CozyGrowthHomeScreen(
    viewModel: HomeViewModel = androidx.lifecycle.viewmodel.compose.viewModel()
) {
    val state by viewModel.state.collectAsState()
    var selectedDuration by remember { mutableStateOf(Duration.MEDIUM) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFFFFF9F0),
                        Color(0xFFF5F8F2)
                    )
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(bottom = 40.dp)
        ) {
            Spacer(modifier = Modifier.height(8.dp))

            // Garden Scene
            GardenScene(
                sunlight = state.sunlight,
                growthProgress = state.growthProgress,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(280.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Progress Indicator
            ProgressIndicator(
                current = state.minutesCompleted,
                goal = state.goalMinutes,
                modifier = Modifier.padding(horizontal = 20.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Currency Bar
            CurrencyBar(
                sunlight = state.sunlight,
                seeds = state.seeds,
                modifier = Modifier.padding(horizontal = 20.dp)
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Nurturing Card
            NurturingCard(
                selectedDuration = selectedDuration,
                onDurationSelected = { selectedDuration = it },
                onCultivate = { viewModel.startSession(selectedDuration.minutes) },
                modifier = Modifier.padding(horizontal = 20.dp)
            )
        }
    }
}

// MARK: - Garden Scene
@Composable
fun GardenScene(
    sunlight: Int,
    growthProgress: Float,
    modifier: Modifier = Modifier
) {
    // Animation states
    val infiniteTransition = rememberInfiniteTransition()

    // Cloud floating - easeInOut for smooth, natural movement
    val cloudOffset by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 40f,
        animationSpec = infiniteRepeatable(
            animation = tween(8000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        )
    )

    // Flower sway - gentle oscillation
    val flowerSway by infiniteTransition.animateFloat(
        initialValue = -5f,
        targetValue = 5f,
        animationSpec = infiniteRepeatable(
            animation = tween(3000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        )
    )

    // Character breathing - subtle scale animation
    val breathScale by infiniteTransition.animateFloat(
        initialValue = 1.0f,
        targetValue = 1.03f,
        animationSpec = infiniteRepeatable(
            animation = tween(2000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        )
    )

    // Sun rotation - very slow, continuous
    val sunRotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(60000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        )
    )

    Box(
        modifier = modifier
            .padding(horizontal = 20.dp)
            .clip(RoundedCornerShape(20.dp))
            .shadow(8.dp, RoundedCornerShape(20.dp))
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            // Sky gradient
            drawRect(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFFA8D5E2),
                        Color(0xFFC8E6F5)
                    )
                )
            )

            // Background hills (3 layers for depth)
            repeat(3) { index ->
                drawCircle(
                    color = Color(0xFF9BC49D).copy(alpha = 0.3f + index * 0.2f),
                    radius = size.width / 3,
                    center = Offset(
                        x = size.width / 4 * (index + 1),
                        y = size.height * 0.7f + index * 20
                    )
                )
            }

            // Sun with glow
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        Color.Yellow.copy(alpha = 0.4f),
                        Color.Transparent
                    ),
                    center = Offset(60f, 50f),
                    radius = 40f
                ),
                radius = 40f,
                center = Offset(60f, 50f)
            )

            rotate(sunRotation, Offset(60f, 50f)) {
                drawCircle(
                    color = Color(0xFFFFD93D),
                    radius = 20f,
                    center = Offset(60f, 50f)
                )
                drawCircle(
                    color = Color(0xFFFFA500),
                    radius = 20f,
                    center = Offset(60f, 50f),
                    style = Stroke(width = 2f)
                )
            }

            // Cloud (with offset animation)
            drawCloud(
                offset = Offset(140f + cloudOffset, 45f),
                size = Size(70f, 30f)
            )

            // Tree
            drawTree(offset = Offset(size.width * 0.85f, 60f))

            // Plant character
            drawPlantCharacter(
                center = Offset(size.width * 0.35f, size.height * 0.7f),
                scale = breathScale
            )

            // Flower
            drawFlower(
                offset = Offset(size.width * 0.65f, size.height * 0.65f),
                progress = growthProgress,
                rotation = flowerSway
            )

            // Watering can
            drawWateringCan(offset = Offset(size.width * 0.25f, size.height * 0.85f))
        }
    }
}

// MARK: - Canvas Drawing Functions
fun DrawScope.drawCloud(offset: Offset, size: Size) {
    drawCircle(
        color = Color.White,
        radius = size.height / 2,
        center = offset
    )
    drawCircle(
        color = Color.White,
        radius = size.height * 0.7f,
        center = offset.copy(x = offset.x + size.width / 3, y = offset.y - size.height / 4)
    )
    drawCircle(
        color = Color.White,
        radius = size.height / 2,
        center = offset.copy(x = offset.x + size.width * 2 / 3)
    )
}

fun DrawScope.drawTree(offset: Offset) {
    // Trunk
    drawRoundRect(
        color = Color(0xFF8B5A3C),
        topLeft = Offset(offset.x - 7.5f, offset.y + 20),
        size = Size(15f, 40f),
        cornerRadius = androidx.compose.ui.geometry.CornerRadius(5f)
    )

    // Foliage layers
    drawCircle(Color(0xFF6B9B3D), radius = 30f, center = offset.copy(x = offset.x - 10, y = offset.y - 5))
    drawCircle(Color(0xFF7BA05B), radius = 27.5f, center = offset.copy(x = offset.x + 10))
    drawCircle(Color(0xFF6B9B3D), radius = 25f, center = offset.copy(y = offset.y - 10))
}

fun DrawScope.drawPlantCharacter(center: Offset, scale: Float) {
    // Body (pear shape)
    drawOval(
        brush = Brush.verticalGradient(
            colors = listOf(
                Color(0xFFA8D672),
                Color(0xFFC5E89B)
            )
        ),
        topLeft = Offset(center.x - 32.5f * scale, center.y - 37.5f * scale),
        size = Size(65f * scale, 75f * scale)
    )

    // Leaves on head
    val leafPath = Path().apply {
        moveTo(center.x - 15, center.y - 50)
        quadraticBezierTo(
            center.x - 25, center.y - 60,
            center.x - 10, center.y - 70
        )
        quadraticBezierTo(
            center.x - 5, center.y - 60,
            center.x - 15, center.y - 50
        )
    }
    drawPath(leafPath, color = Color(0xFF6B9B3D))

    val leafPath2 = Path().apply {
        moveTo(center.x + 15, center.y - 50)
        quadraticBezierTo(
            center.x + 25, center.y - 60,
            center.x + 10, center.y - 70
        )
        quadraticBezierTo(
            center.x + 5, center.y - 60,
            center.x + 15, center.y - 50
        )
    }
    drawPath(leafPath2, color = Color(0xFF6B9B3D))

    // Eyes
    drawCircle(Color(0xFF3D2817), radius = 4f, center = Offset(center.x - 9, center.y - 5))
    drawCircle(Color(0xFF3D2817), radius = 4f, center = Offset(center.x + 9, center.y - 5))

    // Smile (arc)
    val smilePath = Path().apply {
        moveTo(center.x - 10, center.y + 5)
        quadraticBezierTo(
            center.x, center.y + 10,
            center.x + 10, center.y + 5
        )
    }
    drawPath(smilePath, color = Color(0xFF3D2817), style = Stroke(width = 2f))

    // Rosy cheeks
    drawCircle(
        Color(0xFFFFB6C1).copy(alpha = 0.6f),
        radius = 6f,
        center = Offset(center.x - 20, center.y + 5)
    )
    drawCircle(
        Color(0xFFFFB6C1).copy(alpha = 0.6f),
        radius = 6f,
        center = Offset(center.x + 20, center.y + 5)
    )

    // Outfit stripes
    drawRect(
        color = Color(0xFF8B6F47),
        topLeft = Offset(center.x - 25, center.y + 10),
        size = Size(50f, 3f)
    )
    drawRect(
        color = Color(0xFF8B6F47),
        topLeft = Offset(center.x - 25, center.y + 16),
        size = Size(50f, 3f)
    )

    // Feet
    drawRoundRect(
        color = Color(0xFF8B5A3C),
        topLeft = Offset(center.x - 19, center.y + 45),
        size = Size(18f, 10f),
        cornerRadius = androidx.compose.ui.geometry.CornerRadius(5f)
    )
    drawRoundRect(
        color = Color(0xFF8B5A3C),
        topLeft = Offset(center.x + 1, center.y + 45),
        size = Size(18f, 10f),
        cornerRadius = androidx.compose.ui.geometry.CornerRadius(5f)
    )
}

fun DrawScope.drawFlower(offset: Offset, progress: Float, rotation: Float) {
    // Stem (grows with progress)
    drawRect(
        color = Color(0xFF6B9B3D),
        topLeft = Offset(offset.x - 2, offset.y),
        size = Size(4f, 40f * progress)
    )

    // Flower head (appears when progress > 30%)
    if (progress > 0.3f) {
        val flowerScale = ((progress - 0.3f) / 0.7f).coerceAtMost(1f)

        // Petals (5 petals in circle)
        repeat(5) { index ->
            val angle = index * 72f + rotation
            val petalOffset = Offset(
                offset.x + cos(Math.toRadians(angle.toDouble())).toFloat() * 12,
                offset.y - 20 + sin(Math.toRadians(angle.toDouble())).toFloat() * 12
            )

            drawOval(
                brush = Brush.radialGradient(
                    colors = listOf(Color(0xFFFFB6C1), Color(0xFFFF69B4))
                ),
                topLeft = Offset(petalOffset.x - 10 * flowerScale, petalOffset.y - 15 * flowerScale),
                size = Size(20f * flowerScale, 30f * flowerScale)
            )
        }

        // Center
        drawCircle(
            color = Color(0xFFFFD93D),
            radius = 7.5f * flowerScale,
            center = Offset(offset.x, offset.y - 20)
        )
    }
}

fun DrawScope.drawWateringCan(offset: Offset) {
    // Can body
    drawRoundRect(
        color = Color(0xFFC0C0C0),
        topLeft = Offset(offset.x - 12.5f, offset.y - 10),
        size = Size(25f, 20f),
        cornerRadius = androidx.compose.ui.geometry.CornerRadius(5f)
    )

    // Spout
    drawRect(
        color = Color(0xFFC0C0C0),
        topLeft = Offset(offset.x + 13, offset.y - 15),
        size = Size(3f, 12f)
    )

    // Handle (circle stroke)
    drawCircle(
        color = Color(0xFFC0C0C0),
        radius = 7.5f,
        center = Offset(offset.x - 15, offset.y - 5),
        style = Stroke(width = 3f)
    )
}

// MARK: - Progress Indicator
@Composable
fun ProgressIndicator(
    current: Int,
    goal: Int,
    modifier: Modifier = Modifier
) {
    val progress = (current.toFloat() / goal.toFloat()).coerceIn(0f, 1f)

    // Animated progress for smooth transitions
    val animatedProgress by animateFloatAsState(
        targetValue = progress,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessLow
        )
    )

    Column(
        modifier = modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "$current/$goal Minutes of Growth",
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            color = Color(0xFF6B5D4F)
        )

        Spacer(modifier = Modifier.height(8.dp))

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(8.dp)
                .clip(RoundedCornerShape(10.dp))
                .background(Color(0xFFE8E4DC))
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth(animatedProgress)
                    .fillMaxHeight()
                    .clip(RoundedCornerShape(10.dp))
                    .background(
                        Brush.horizontalGradient(
                            colors = listOf(
                                Color(0xFF7BA05B),
                                Color(0xFFA8D672)
                            )
                        )
                    )
            )
        }
    }
}

// MARK: - Currency Bar
@Composable
fun CurrencyBar(
    sunlight: Int,
    seeds: Int,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .shadow(4.dp, RoundedCornerShape(20.dp))
            .clip(RoundedCornerShape(20.dp))
            .background(Color.White.copy(alpha = 0.9f))
            .padding(horizontal = 20.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Sunlight
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(30.dp)
                    .clip(CircleShape)
                    .background(Color.Yellow.copy(alpha = 0.2f)),
                contentAlignment = Alignment.Center
            ) {
                Text("☀️", fontSize = 18.sp)
            }

            Text(
                text = "Sunlight: $sunlight",
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF3D2817)
            )
        }

        Spacer(modifier = Modifier.width(24.dp))

        // Separator
        Box(
            modifier = Modifier
                .width(1.dp)
                .height(20.dp)
                .background(Color(0xFFD4CFC7))
        )

        Spacer(modifier = Modifier.width(24.dp))

        // Seeds
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Text("🌰", fontSize = 18.sp)

            Text(
                text = "Seeds: $seeds",
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF3D2817)
            )
        }
    }
}

// MARK: - Nurturing Card
@Composable
fun NurturingCard(
    selectedDuration: Duration,
    onDurationSelected: (Duration) -> Unit,
    onCultivate: () -> Unit,
    modifier: Modifier = Modifier
) {
    val haptic = LocalHapticFeedback.current

    Card(
        modifier = modifier
            .fillMaxWidth()
            .shadow(8.dp, RoundedCornerShape(20.dp)),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFFF5E6D3))
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Nurturing Duration",
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF3D2817)
            )

            Spacer(modifier = Modifier.height(20.dp))

            // Seed packet selector
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Duration.values().forEach { duration ->
                    SeedPacket(
                        duration = duration,
                        isSelected = selectedDuration == duration,
                        onClick = {
                            haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                            onDurationSelected(duration)
                        },
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Cultivate button (wooden texture)
            WoodenButton(
                onClick = {
                    haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                    onCultivate()
                }
            )
        }
    }
}

// MARK: - Seed Packet
@Composable
fun SeedPacket(
    duration: Duration,
    isSelected: Boolean,
    onClick: () -> Void,
    modifier: Modifier = Modifier
) {
    // Bouncy scale animation on selection - easeOutBack for playful overshoot
    var isPressed by remember { mutableStateOf(false) }
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 1.15f else 1f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessMedium
        )
    )

    Column(
        modifier = modifier
            .scale(scale)
            .clickable {
                isPressed = true
                onClick()
            }
            .padding(4.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // Seed packet
        Box(
            modifier = Modifier
                .width(60.dp)
                .height(70.dp)
                .shadow(if (isSelected) 5.dp else 0.dp, RoundedCornerShape(8.dp))
                .clip(RoundedCornerShape(8.dp))
                .background(
                    Brush.verticalGradient(duration.colors)
                )
                .border(
                    width = if (isSelected) 3.dp else 1.5.dp,
                    color = duration.borderColor,
                    shape = RoundedCornerShape(8.dp)
                ),
            contentAlignment = Alignment.Center
        ) {
            // Seeds illustration
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(3.dp)) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(Color(0xFF5C4033))
                    )
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(Color(0xFF5C4033))
                    )
                }
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(CircleShape)
                        .background(Color(0xFF5C4033))
                )
            }
        }

        Text(
            text = "${duration.minutes} min",
            fontSize = 13.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
            color = if (isSelected) Color(0xFF3D2817) else Color(0xFF8B7355)
        )
    }

    // Reset pressed state after animation
    LaunchedEffect(isPressed) {
        if (isPressed) {
            kotlinx.coroutines.delay(150)
            isPressed = false
        }
    }
}

// MARK: - Wooden Button
@Composable
fun WoodenButton(onClick: () -> Unit) {
    var isPressed by remember { mutableStateOf(false) }
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.95f else 1f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessHigh
        )
    )

    Button(
        onClick = {
            isPressed = true
            onClick()
        },
        modifier = Modifier
            .fillMaxWidth()
            .scale(scale)
            .shadow(8.dp, RoundedCornerShape(25.dp)),
        shape = RoundedCornerShape(25.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = Color.Transparent
        ),
        contentPadding = PaddingValues(0.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Brush.linearGradient(
                        colors = listOf(
                            Color(0xFF8B5A3C),
                            Color(0xFFA0826D),
                            Color(0xFF8B5A3C)
                        )
                    )
                )
                .border(2.dp, Color(0xFF6B4423), RoundedCornerShape(25.dp))
                .padding(vertical = 18.dp),
            contentAlignment = Alignment.Center
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("🌱", fontSize = 20.sp)
                Text(
                    text = "Cultivate One Tiny Step",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }
        }
    }

    // Reset pressed state
    LaunchedEffect(isPressed) {
        if (isPressed) {
            kotlinx.coroutines.delay(100)
            isPressed = false
        }
    }
}

// MARK: - Data Models
enum class Duration(val minutes: Int, val colors: List<Color>, val borderColor: Color) {
    SHORT(
        minutes = 5,
        colors = listOf(Color(0xFFF5DEB3), Color(0xFFD2B48C)),
        borderColor = Color(0xFF8B7355)
    ),
    MEDIUM(
        minutes = 10,
        colors = listOf(Color(0xFFC8E6A0), Color(0xFFA8D672)),
        borderColor = Color(0xFF6B9B3D)
    ),
    LONG(
        minutes = 15,
        colors = listOf(Color(0xFFFFB6A0), Color(0xFFFF9B85)),
        borderColor = Color(0xFFC19A6B)
    )
}

data class HomeState(
    val sunlight: Int = 50,
    val seeds: Int = 120,
    val minutesCompleted: Int = 15,
    val goalMinutes: Int = 30,
    val growthProgress: Float = 0.5f
)

// MARK: - ViewModel
class HomeViewModel : androidx.lifecycle.ViewModel() {
    private val _state = kotlinx.coroutines.flow.MutableStateFlow(HomeState())
    val state: kotlinx.coroutines.flow.StateFlow<HomeState> = _state

    fun startSession(durationMinutes: Int) {
        // Navigate to timer screen
        println("Starting session: $durationMinutes minutes")
    }
}
