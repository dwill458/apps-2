"""
Geo-Fencing and Compliance Module
Ensures users are in legally approved states for sports betting.

CRITICAL COMPLIANCE NOTES:
- Sports betting is highly regulated in the United States
- Each state has different laws regarding online sports betting
- This module helps enforce geographic restrictions
- ALWAYS consult with legal counsel before launching
- This is a basic implementation and may need enhancement
"""
import logging
from typing import Optional, Tuple
from dataclasses import dataclass
from core.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)


@dataclass
class GeoLocation:
    """Geographic location data."""
    ip_address: str
    country_code: str
    state_code: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    postal_code: Optional[str] = None
    is_vpn: bool = False
    is_proxy: bool = False


class GeoFencingService:
    """
    Service for geographic validation and compliance.

    This service determines if a user is located in a state where
    online sports betting is legal and approved.

    LEGAL DISCLAIMER:
    This is a basic geo-fencing implementation. Production systems
    should use professional geo-location services and legal review.

    States with legal online sports betting (as of 2024):
    - New Jersey (NJ) - Pioneer state
    - Pennsylvania (PA)
    - Indiana (IN)
    - West Virginia (WV)
    - Colorado (CO)
    - Tennessee (TN)
    - Virginia (VA)
    - Iowa (IA)
    - Illinois (IL)
    - Michigan (MI)
    - Arizona (AZ)
    - Louisiana (LA)
    - New York (NY)
    - Connecticut (CT)
    - Kansas (KS)
    - Maryland (MD)
    - Ohio (OH)
    - Wyoming (WY)
    - Massachusetts (MA)
    - And more...

    Usage:
        service = GeoFencingService()
        is_allowed, reason = service.check_access(user_ip)
    """

    def __init__(self):
        """Initialize geo-fencing service."""
        self.enabled = settings.ENABLE_GEO_FENCING
        self.allowed_states = settings.allowed_states_list

        logger.info(
            f"GeoFencingService initialized (enabled={self.enabled}, "
            f"allowed_states={len(self.allowed_states)})"
        )

    def check_access(
        self,
        ip_address: str,
        state_code: Optional[str] = None
    ) -> Tuple[bool, str]:
        """
        Check if user is allowed to access betting features.

        Args:
            ip_address: User's IP address
            state_code: Optional state code if already known

        Returns:
            Tuple of (is_allowed, reason)
        """
        if not self.enabled:
            return True, "Geo-fencing disabled"

        # If state code provided, use it
        if state_code:
            return self._check_state_approval(state_code)

        # Otherwise, look up location from IP
        location = self.lookup_location(ip_address)

        if not location:
            return False, "Unable to determine location"

        # Check for VPN/Proxy usage (prohibited for compliance)
        if location.is_vpn or location.is_proxy:
            logger.warning(f"VPN/Proxy detected for IP: {ip_address}")
            return False, "VPN or proxy usage is not permitted for compliance reasons"

        # Check country
        if location.country_code != "US":
            return False, f"Service not available in {location.country_code}"

        # Check state
        if not location.state_code:
            return False, "Unable to determine state"

        return self._check_state_approval(location.state_code)

    def _check_state_approval(self, state_code: str) -> Tuple[bool, str]:
        """
        Check if a state is approved for online sports betting.

        Args:
            state_code: Two-letter state code (e.g., "NJ", "PA")

        Returns:
            Tuple of (is_approved, message)
        """
        state_upper = state_code.upper()

        if state_upper in self.allowed_states:
            logger.info(f"Access granted for state: {state_upper}")
            return True, f"Online sports betting is legal in {state_upper}"

        logger.warning(f"Access denied for state: {state_upper}")
        return False, (
            f"Online sports betting is not currently available in {state_upper}. "
            f"Available states: {', '.join(self.allowed_states)}"
        )

    def lookup_location(self, ip_address: str) -> Optional[GeoLocation]:
        """
        Look up geographic location from IP address.

        PRODUCTION NOTE:
        This is a simplified implementation. In production, you should use:
        - MaxMind GeoIP2 (https://www.maxmind.com/)
        - IP2Location (https://www.ip2location.com/)
        - ipapi.co or similar services

        For MaxMind GeoIP2 implementation:
        1. Download GeoLite2-City database from MaxMind
        2. Install: pip install geoip2
        3. Use the code below (commented out):

        ```python
        import geoip2.database
        reader = geoip2.database.Reader(settings.GEOIP_DATABASE_PATH)
        try:
            response = reader.city(ip_address)
            return GeoLocation(
                ip_address=ip_address,
                country_code=response.country.iso_code,
                state_code=response.subdivisions.most_specific.iso_code,
                city=response.city.name,
                latitude=response.location.latitude,
                longitude=response.location.longitude,
                postal_code=response.postal.code
            )
        except Exception as e:
            logger.error(f"GeoIP lookup failed: {e}")
            return None
        ```

        Args:
            ip_address: IP address to look up

        Returns:
            GeoLocation object or None if lookup fails
        """
        # MOCK IMPLEMENTATION for testing
        # Replace with real GeoIP service in production
        logger.warning("Using MOCK geo-location service - not for production!")

        # Mock: Treat local IPs as New Jersey for testing
        if ip_address.startswith("127.") or ip_address.startswith("192.168."):
            return GeoLocation(
                ip_address=ip_address,
                country_code="US",
                state_code="NJ",
                city="Newark",
                is_vpn=False,
                is_proxy=False
            )

        # Mock: Some example IPs
        mock_locations = {
            "203.0.113.1": GeoLocation(
                ip_address=ip_address,
                country_code="US",
                state_code="PA",
                city="Philadelphia"
            ),
            "203.0.113.2": GeoLocation(
                ip_address=ip_address,
                country_code="US",
                state_code="CA",  # Not approved
                city="Los Angeles"
            ),
            "198.51.100.1": GeoLocation(
                ip_address=ip_address,
                country_code="CA",  # Canada - not allowed
                state_code=None,
                city="Toronto"
            ),
        }

        return mock_locations.get(
            ip_address,
            GeoLocation(
                ip_address=ip_address,
                country_code="US",
                state_code="NJ",  # Default to NJ for testing
                city="Unknown"
            )
        )

    def get_legal_disclaimer(self, state_code: str) -> str:
        """
        Get state-specific legal disclaimer text.

        Each state may have specific requirements for disclaimers.

        Args:
            state_code: Two-letter state code

        Returns:
            HTML-formatted legal disclaimer
        """
        base_disclaimer = """
        <div class="legal-disclaimer">
            <h3>Legal Disclaimer</h3>
            <p><strong>IMPORTANT:</strong> This service provides betting analysis and predictions
            for informational and entertainment purposes only.</p>

            <ul>
                <li>You must be 21 years or older to use this service</li>
                <li>Sports betting involves risk - never bet more than you can afford to lose</li>
                <li>If you or someone you know has a gambling problem, call 1-800-GAMBLER</li>
                <li>This service does not place bets on your behalf</li>
                <li>Past performance does not guarantee future results</li>
            </ul>

            <p><strong>Responsible Gaming Resources:</strong></p>
            <ul>
                <li>National Council on Problem Gambling: <a href="https://www.ncpgambling.org/">ncpgambling.org</a></li>
                <li>Gamblers Anonymous: <a href="https://www.gamblersanonymous.org/">gamblersanonymous.org</a></li>
            </ul>
        </div>
        """

        # State-specific additions
        state_specific = {
            "NJ": "<p><strong>New Jersey:</strong> Licensed by the New Jersey Division of Gaming Enforcement.</p>",
            "PA": "<p><strong>Pennsylvania:</strong> If you or someone you know has a gambling problem, help is available. Call 1-800-GAMBLER.</p>",
            "NY": "<p><strong>New York:</strong> Please play responsibly. For help, call the NYS HOPEline at 1-877-8-HOPENY.</p>",
        }

        state_text = state_specific.get(state_code.upper(), "")

        return base_disclaimer + state_text

    def is_state_legal(self, state_code: str) -> bool:
        """
        Simple check if a state allows online sports betting.

        Args:
            state_code: Two-letter state code

        Returns:
            True if state allows online sports betting
        """
        return state_code.upper() in self.allowed_states

    def get_approved_states(self) -> list[str]:
        """
        Get list of approved states.

        Returns:
            List of two-letter state codes
        """
        return self.allowed_states.copy()


class ComplianceValidator:
    """
    Validates compliance requirements for users.

    This class handles age verification, identity checks,
    and other regulatory requirements.
    """

    MINIMUM_AGE = 21  # Federal minimum for sports betting

    @staticmethod
    def validate_age(birth_date) -> Tuple[bool, str]:
        """
        Validate user is of legal age.

        Args:
            birth_date: User's date of birth (datetime object)

        Returns:
            Tuple of (is_valid, message)
        """
        from datetime import datetime, timedelta

        if not birth_date:
            return False, "Birth date required"

        age = (datetime.now() - birth_date).days // 365

        if age < ComplianceValidator.MINIMUM_AGE:
            return False, f"You must be at least {ComplianceValidator.MINIMUM_AGE} years old"

        return True, "Age verified"

    @staticmethod
    def validate_identity(
        first_name: str,
        last_name: str,
        ssn_last4: str,
        address: str,
        state: str
    ) -> Tuple[bool, str]:
        """
        Validate user identity.

        PRODUCTION NOTE:
        Real identity verification should use third-party services like:
        - Jumio
        - Onfido
        - Trulioo
        - Socure

        This is a placeholder for the actual verification logic.

        Args:
            first_name: User's first name
            last_name: User's last name
            ssn_last4: Last 4 digits of SSN
            address: Street address
            state: State code

        Returns:
            Tuple of (is_verified, message)
        """
        # Basic validation
        if not all([first_name, last_name, ssn_last4, address, state]):
            return False, "All identity fields are required"

        if len(ssn_last4) != 4 or not ssn_last4.isdigit():
            return False, "Invalid SSN format (last 4 digits)"

        # MOCK: Always pass for development
        # Replace with real identity verification service
        logger.warning("Using MOCK identity verification - not for production!")
        return True, "Identity verified (MOCK)"

    @staticmethod
    def get_responsible_gaming_message() -> str:
        """
        Get responsible gaming message to display to users.

        Returns:
            Responsible gaming message
        """
        return """
        🎲 **Play Responsibly**

        - Set a budget and stick to it
        - Never chase losses
        - Take regular breaks
        - Betting should be fun, not a way to make money
        - If gambling stops being fun, seek help

        **Get Help:**
        - National Problem Gambling Helpline: 1-800-522-4700
        - Chat: NCPGambling.org/chat
        - Text: 1-800-522-4700
        """


# Example usage
if __name__ == "__main__":
    # Test geo-fencing
    service = GeoFencingService()

    test_cases = [
        ("127.0.0.1", "NJ"),  # Local IP, mock NJ
        ("203.0.113.1", "PA"),  # Mock PA
        ("203.0.113.2", "CA"),  # Mock CA (not approved)
        ("198.51.100.1", None),  # Mock Canada
    ]

    print("=" * 60)
    print("GEO-FENCING TEST RESULTS")
    print("=" * 60)

    for ip, state in test_cases:
        is_allowed, reason = service.check_access(ip, state)
        status = "✓ ALLOWED" if is_allowed else "✗ DENIED"
        print(f"\nIP: {ip} | State: {state}")
        print(f"Status: {status}")
        print(f"Reason: {reason}")

    # Test state approval
    print("\n" + "=" * 60)
    print("APPROVED STATES")
    print("=" * 60)
    print(", ".join(service.get_approved_states()))

    # Test legal disclaimer
    print("\n" + "=" * 60)
    print("LEGAL DISCLAIMER (NJ)")
    print("=" * 60)
    print(service.get_legal_disclaimer("NJ"))
