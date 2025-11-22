/**
 * Unity C# Implementation - Cozy Growth Home Screen
 * Using DOTween for smooth UI animations
 * Assumes Unity UI Canvas setup with UI elements
 */

using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;
using System.Collections;
using System.Collections.Generic;
using TMPro;

namespace CozyGrowth.UI
{
    /// <summary>
    /// Main controller for the Cozy Growth home screen
    /// Handles all UI animations and interactions
    /// </summary>
    public class CozyGrowthHomeController : MonoBehaviour
    {
        [Header("Garden Scene References")]
        [SerializeField] private CanvasGroup gardenSceneCanvas;
        [SerializeField] private RectTransform cloudTransform;
        [SerializeField] private RectTransform flowerTransform;
        [SerializeField] private RectTransform plantCharacterTransform;
        [SerializeField] private RectTransform sunTransform;
        [SerializeField] private Image progressBarFill;

        [Header("Currency UI")]
        [SerializeField] private TextMeshProUGUI sunlightText;
        [SerializeField] private TextMeshProUGUI seedsText;
        [SerializeField] private TextMeshProUGUI progressText;

        [Header("Nurturing Card")]
        [SerializeField] private Button[] seedPacketButtons; // 5min, 10min, 15min
        [SerializeField] private Image[] seedPacketImages;
        [SerializeField] private RectTransform[] seedPacketTransforms;
        [SerializeField] private Button cultivateButton;
        [SerializeField] private RectTransform cultivateButtonTransform;

        [Header("Animation Settings")]
        [SerializeField] private float cloudDriftDistance = 40f;
        [SerializeField] private float cloudDriftDuration = 8f;
        [SerializeField] private float flowerSwayAngle = 5f;
        [SerializeField] private float flowerSwayDuration = 3f;
        [SerializeField] private float characterBreathScale = 1.03f;
        [SerializeField] private float characterBreathDuration = 2f;

        [Header("Colors")]
        [SerializeField] private Color seedPacketNormalBorder = new Color(0.545f, 0.435f, 0.333f, 1f); // #8B7355
        [SerializeField] private Color seedPacketSelectedBorder = new Color(0.42f, 0.608f, 0.24f, 1f); // #6B9B3D

        // State
        private int selectedDuration = 10; // Default: 10 minutes
        private float currentProgress = 0.5f;
        private int sunlight = 50;
        private int seeds = 120;
        private int minutesCompleted = 15;
        private int goalMinutes = 30;

        // Tweens (store references for cleanup)
        private Tween cloudTween;
        private Tween flowerTween;
        private Tween characterTween;
        private Tween sunTween;

        #region Unity Lifecycle

        private void Start()
        {
            InitializeUI();
            StartGardenAnimations();
            SetupButtonListeners();
        }

        private void OnDestroy()
        {
            // Clean up all tweens to prevent memory leaks
            cloudTween?.Kill();
            flowerTween?.Kill();
            characterTween?.Kill();
            sunTween?.Kill();
            DOTween.Kill(this); // Kill all tweens created by this object
        }

        #endregion

        #region Initialization

        private void InitializeUI()
        {
            UpdateCurrencyDisplay();
            UpdateProgressBar(currentProgress, true);
            SelectDuration(1); // Select 10min by default (index 1)
        }

        private void SetupButtonListeners()
        {
            // Seed packet buttons
            for (int i = 0; i < seedPacketButtons.Length; i++)
            {
                int index = i; // Capture for closure
                seedPacketButtons[i].onClick.AddListener(() => OnSeedPacketClicked(index));
            }

            // Cultivate button
            cultivateButton.onClick.AddListener(OnCultivateClicked);
        }

        #endregion

        #region Garden Animations

        /// <summary>
        /// Start all looping animations in the garden scene
        /// Using DOTween for smooth, performant animations
        /// </summary>
        private void StartGardenAnimations()
        {
            // Cloud floating - EaseInOutSine for smooth, natural movement
            Vector2 cloudStartPos = cloudTransform.anchoredPosition;
            cloudTween = cloudTransform.DOAnchorPosX(cloudStartPos.x + cloudDriftDistance, cloudDriftDuration)
                .SetEase(Ease.InOutSine)
                .SetLoops(-1, LoopType.Yoyo)
                .SetUpdate(true); // Use unscaled time

            // Flower swaying - EaseInOutSine for gentle, realistic sway
            flowerTween = flowerTransform.DORotate(new Vector3(0, 0, flowerSwayAngle), flowerSwayDuration)
                .SetEase(Ease.InOutSine)
                .SetLoops(-1, LoopType.Yoyo)
                .SetUpdate(true);

            // Character breathing - subtle scale animation for "alive" feeling
            // Using EaseInOutSine for natural breathing rhythm
            characterTween = plantCharacterTransform.DOScale(
                new Vector3(1f, characterBreathScale, 1f),
                characterBreathDuration
            )
                .SetEase(Ease.InOutSine)
                .SetLoops(-1, LoopType.Yoyo)
                .SetUpdate(true);

            // Sun rotation - very slow, continuous rotation
            sunTween = sunTransform.DORotate(new Vector3(0, 0, 360), 60f, RotateMode.FastBeyond360)
                .SetEase(Ease.Linear)
                .SetLoops(-1, LoopType.Restart)
                .SetUpdate(true);
        }

        #endregion

        #region UI Updates

        private void UpdateCurrencyDisplay()
        {
            sunlightText.text = $"Sunlight: {sunlight}";
            seedsText.text = $"Seeds: {seeds}";
            progressText.text = $"{minutesCompleted}/{goalMinutes} Minutes of Growth";
        }

        /// <summary>
        /// Animate the progress bar fill
        /// Using spring animation for satisfying, bouncy feel
        /// </summary>
        private void UpdateProgressBar(float targetProgress, bool immediate = false)
        {
            if (immediate)
            {
                progressBarFill.fillAmount = targetProgress;
            }
            else
            {
                // Using OutBack easing for slight overshoot, then settling
                // This creates a satisfying "elastic" feel
                progressBarFill.DOFillAmount(targetProgress, 0.5f)
                    .SetEase(Ease.OutBack)
                    .SetUpdate(true);
            }
        }

        #endregion

        #region Interaction Handlers

        /// <summary>
        /// Handle seed packet selection with bouncy animation
        /// Using OutBack easing for playful overshoot effect
        /// </summary>
        private void OnSeedPacketClicked(int packetIndex)
        {
            // Haptic feedback (if supported)
            #if UNITY_IOS || UNITY_ANDROID
            Handheld.Vibrate();
            #endif

            SelectDuration(packetIndex);

            // Bouncy scale animation - OutBack for playful "pop"
            RectTransform packet = seedPacketTransforms[packetIndex];
            packet.DOKill(); // Kill any existing animation

            Sequence bounceSequence = DOTween.Sequence();
            bounceSequence.Append(packet.DOScale(1.15f, 0.15f).SetEase(Ease.OutBack))
                         .Append(packet.DOScale(1f, 0.15f).SetEase(Ease.InBack));
        }

        private void SelectDuration(int packetIndex)
        {
            // Update selection state
            int[] durations = { 5, 10, 15 };
            selectedDuration = durations[packetIndex];

            // Update visual state of all packets
            for (int i = 0; i < seedPacketButtons.Length; i++)
            {
                bool isSelected = i == packetIndex;

                // Update border (you'd typically have an Outline component)
                var outline = seedPacketButtons[i].GetComponent<Outline>();
                if (outline != null)
                {
                    outline.effectColor = isSelected ? seedPacketSelectedBorder : seedPacketNormalBorder;
                    outline.effectDistance = isSelected ? new Vector2(3, 3) : new Vector2(1.5f, 1.5f);
                }

                // Animate shadow/glow effect
                Image packetImage = seedPacketImages[i];
                Shadow shadow = packetImage.GetComponent<Shadow>();
                if (shadow != null)
                {
                    shadow.DOFade(isSelected ? 0.15f : 0f, 0.2f);
                }
            }
        }

        /// <summary>
        /// Handle cultivate button press with satisfying press animation
        /// Using spring-based animation for responsive feel
        /// </summary>
        private void OnCultivateClicked()
        {
            // Strong haptic feedback
            #if UNITY_IOS || UNITY_ANDROID
            Handheld.Vibrate();
            #endif

            // Press animation - scale down then spring back
            // Using OutElastic for bouncy, satisfying feedback
            cultivateButtonTransform.DOKill();

            Sequence pressSequence = DOTween.Sequence();
            pressSequence.Append(cultivateButtonTransform.DOScale(0.95f, 0.1f).SetEase(Ease.OutQuad))
                        .Append(cultivateButtonTransform.DOScale(1f, 0.3f).SetEase(Ease.OutElastic));

            // Trigger game logic
            StartCoroutine(StartSessionCoroutine());
        }

        private IEnumerator StartSessionCoroutine()
        {
            // Wait for button animation to complete
            yield return new WaitForSeconds(0.2f);

            // Start the focus session
            Debug.Log($"Starting session: {selectedDuration} minutes");

            // Transition to timer screen (implement your scene transition here)
            // SceneManager.LoadScene("TimerScene");
            // Or use your custom screen manager:
            // ScreenManager.Instance.ShowTimerScreen(selectedDuration);
        }

        #endregion

        #region Public API

        /// <summary>
        /// Update growth progress from external source
        /// </summary>
        public void SetGrowthProgress(float progress)
        {
            currentProgress = Mathf.Clamp01(progress);
            UpdateProgressBar(currentProgress);
        }

        /// <summary>
        /// Update currency values
        /// </summary>
        public void SetCurrency(int newSunlight, int newSeeds)
        {
            sunlight = newSunlight;
            seeds = newSeeds;
            UpdateCurrencyDisplay();

            // Optional: Animate the text for feedback
            AnimateCurrencyChange();
        }

        /// <summary>
        /// Update daily progress
        /// </summary>
        public void SetProgress(int completed, int goal)
        {
            minutesCompleted = completed;
            goalMinutes = goal;
            UpdateCurrencyDisplay();
            SetGrowthProgress((float)completed / goal);
        }

        #endregion

        #region Helper Animations

        /// <summary>
        /// Add a subtle scale pulse to currency text when values change
        /// Provides visual feedback for earning rewards
        /// </summary>
        private void AnimateCurrencyChange()
        {
            sunlightText.transform.DOKill();
            seedsText.transform.DOKill();

            // Pulse animation - OutBack for satisfying "pop"
            Sequence pulseSequence = DOTween.Sequence();
            pulseSequence.Append(sunlightText.transform.DOScale(1.1f, 0.15f).SetEase(Ease.OutBack))
                        .Join(seedsText.transform.DOScale(1.1f, 0.15f).SetEase(Ease.OutBack))
                        .Append(sunlightText.transform.DOScale(1f, 0.15f).SetEase(Ease.InBack))
                        .Join(seedsText.transform.DOScale(1f, 0.15f).SetEase(Ease.InBack));
        }

        #endregion
    }

    #region Custom UI Components

    /// <summary>
    /// Custom component for the kawaii plant character
    /// Handles additional character-specific animations
    /// </summary>
    public class PlantCharacterAnimator : MonoBehaviour
    {
        [SerializeField] private Image bodyImage;
        [SerializeField] private RectTransform eyeLeft;
        [SerializeField] private RectTransform eyeRight;

        private Tween blinkTween;

        private void Start()
        {
            StartBlinking();
        }

        /// <summary>
        /// Periodic blinking animation for kawaii character
        /// </summary>
        private void StartBlinking()
        {
            StartCoroutine(BlinkRoutine());
        }

        private IEnumerator BlinkRoutine()
        {
            while (true)
            {
                // Wait random interval (2-4 seconds)
                yield return new WaitForSeconds(Random.Range(2f, 4f));

                // Blink animation - quick scale down/up on Y axis
                Sequence blinkSequence = DOTween.Sequence();
                blinkSequence.Append(eyeLeft.DOScaleY(0.1f, 0.05f))
                            .Join(eyeRight.DOScaleY(0.1f, 0.05f))
                            .Append(eyeLeft.DOScaleY(1f, 0.05f))
                            .Join(eyeRight.DOScaleY(1f, 0.05f));
            }
        }

        private void OnDestroy()
        {
            blinkTween?.Kill();
            DOTween.Kill(this);
        }
    }

    /// <summary>
    /// Wooden button texture and animation controller
    /// Simulates wood grain texture through gradient and noise
    /// </summary>
    public class WoodenButton : MonoBehaviour
    {
        [SerializeField] private Image buttonImage;
        [SerializeField] private Gradient woodGradient;

        private void Start()
        {
            ApplyWoodenTexture();
        }

        /// <summary>
        /// Apply wooden texture using gradient
        /// For best results, use a brown gradient in the inspector:
        /// Color 1: #8B5A3C
        /// Color 2: #A0826D
        /// Color 3: #8B5A3C
        /// </summary>
        private void ApplyWoodenTexture()
        {
            // In production, you'd use a sprite or procedural texture
            // This is a simplified version using gradient
            if (buttonImage != null)
            {
                // Set to gradient texture or sprite
                // buttonImage.sprite = woodenButtonSprite;
            }
        }

        /// <summary>
        /// Add press depth effect when button is pressed
        /// Creates illusion of 3D wooden button being pressed
        /// </summary>
        public void OnButtonPress()
        {
            // Scale down slightly
            transform.DOScale(0.95f, 0.1f).SetEase(Ease.OutQuad);

            // Darken color slightly
            buttonImage.DOColor(new Color(0.9f, 0.9f, 0.9f), 0.1f);
        }

        public void OnButtonRelease()
        {
            // Spring back to original size - OutBack for satisfying bounce
            transform.DOScale(1f, 0.3f).SetEase(Ease.OutBack);

            // Restore color
            buttonImage.DOColor(Color.white, 0.2f);
        }
    }

    #endregion

    #region Data Models

    [System.Serializable]
    public class GardenState
    {
        public int sunlight;
        public int seeds;
        public int minutesCompleted;
        public int goalMinutes;
        public float plantGrowthProgress; // 0-1
        public string weatherMood; // "sunny" or "rainy"
    }

    [System.Serializable]
    public class AvatarState
    {
        public string mood; // "happy", "working", "idle", etc.
        public string outfit; // "farmer", "apron", etc.
        public string accessory; // "trowel", "watering-can", etc.
    }

    #endregion
}

/*
 * SETUP INSTRUCTIONS:
 *
 * 1. Install DOTween (free version) from Unity Asset Store
 * 2. Create a Canvas with the following hierarchy:
 *    - Canvas
 *      |- GardenScene (Image with rounded corners)
 *         |- Sun (Image, rotatable)
 *         |- Cloud (Image, will animate horizontally)
 *         |- PlantCharacter (Image with child elements)
 *         |- Flower (Image, will rotate for sway)
 *      |- ProgressBar (Image + Filled Image)
 *      |- CurrencyBar (HorizontalLayoutGroup)
 *         |- SunlightText (TextMeshPro)
 *         |- SeedsText (TextMeshPro)
 *      |- NurturingCard (Image with rounded corners)
 *         |- SeedPackets (HorizontalLayoutGroup)
 *            |- SeedPacket5 (Button)
 *            |- SeedPacket10 (Button)
 *            |- SeedPacket15 (Button)
 *         |- CultivateButton (Button with wooden texture)
 *
 * 3. Assign all references in the inspector
 * 4. Set up button onClick listeners to reference this script
 * 5. For production, replace placeholder graphics with actual kawaii sprites
 */
