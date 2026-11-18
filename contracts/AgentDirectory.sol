// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title AgentID Card — on-chain profile directory for Binance Agent ID holders
/// @author wantorieta15.ai (Binance Agent ID Hackathon 2026)
/// @notice Only addresses that hold a SPACE ID Agent ID (name.ai) can create a
/// profile. The handle is read DIRECTLY from the Agent ID registry on-chain
/// (handleOf), so a profile can never be created for a handle the caller
/// does not own. No payments, no owner, no admin functions, no pausing:
/// the contract is fully permissionless and immutable once deployed.
interface IHandleRegistry {
    function handleOf(address account) external view returns (string memory);
    function balanceOf(address account) external view returns (uint256);
    function ownerOfHandle(string calldata handle) external view returns (address);
}

contract AgentDirectory {
    /// @dev SPACE ID Agent ID registry (ERC-721 "SPACE ID Agent ID", symbol AI).
    IHandleRegistry public constant AGENT_ID =
        IHandleRegistry(0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F);

    uint256 public constant MAX_BIO_LEN = 280;
    uint256 public constant MAX_TAGS_LEN = 140;
    uint256 public constant MAX_LINK_LEN = 140;

    struct Profile {
        address holder;
        string handle; // e.g. "wantorieta15" (displayed as wantorieta15.ai)
        string bio;
        string tags; // comma-separated, e.g. "defi,nft,agent"
        string link; // e.g. "x.com/wantorieta15"
        uint256 updatedAt;
    }

    mapping(address => Profile) private _profiles;
    mapping(string => address) private _handleToAddress;
    uint256 public profileCount;

    /// @dev handle is NOT indexed so the full string stays readable in logs.
    event ProfileSet(address indexed holder, string handle, uint256 updatedAt);
    event ProfileRemoved(address indexed holder, string handle);

    error NotAgentIDHolder();
    error EmptyBio();
    error TooLong();
    error NoProfile();

    modifier onlyHolder() {
        if (AGENT_ID.balanceOf(msg.sender) == 0) revert NotAgentIDHolder();
        _;
    }

    /// @notice Create or update your Agent ID profile. The handle is taken
    /// from the registry, never from user input, so it cannot be faked.
    function setProfile(
        string calldata bio,
        string calldata tags,
        string calldata link
    ) external onlyHolder {
        string memory handle = AGENT_ID.handleOf(msg.sender);
        if (bytes(handle).length == 0) revert NotAgentIDHolder();
        if (bytes(bio).length == 0) revert EmptyBio();
        if (
            bytes(bio).length > MAX_BIO_LEN ||
            bytes(tags).length > MAX_TAGS_LEN ||
            bytes(link).length > MAX_LINK_LEN
        ) revert TooLong();

        bool isNew = bytes(_profiles[msg.sender].handle).length == 0;
        _profiles[msg.sender] = Profile({
            holder: msg.sender,
            handle: handle,
            bio: bio,
            tags: tags,
            link: link,
            updatedAt: block.timestamp
        });
        _handleToAddress[handle] = msg.sender;
        if (isNew) profileCount += 1;

        emit ProfileSet(msg.sender, handle, block.timestamp);
    }

    /// @notice Delete your own profile. Only the holder can remove it.
    function removeProfile() external {
        Profile memory p = _profiles[msg.sender];
        if (bytes(p.handle).length == 0) revert NoProfile();
        delete _handleToAddress[p.handle];
        delete _profiles[msg.sender];
        profileCount -= 1;
        emit ProfileRemoved(msg.sender, p.handle);
    }

    /// @notice Read a profile by wallet address.
    function getProfile(
        address holder
    ) external view returns (Profile memory) {
        return _profiles[holder];
    }

    /// @notice Read a profile by Agent ID handle (without the ".ai" suffix).
    function getProfileByHandle(
        string calldata handle
    ) external view returns (Profile memory) {
        return _profiles[_handleToAddress[handle]];
    }

    /// @notice Convenience check: does this address hold an Agent ID?
    function isHolder(address account) external view returns (bool) {
        return AGENT_ID.balanceOf(account) > 0;
    }

    /// @notice Convenience read: the Agent ID handle of an address.
    function handleOf(address account) external view returns (string memory) {
        return AGENT_ID.handleOf(account);
    }
}
