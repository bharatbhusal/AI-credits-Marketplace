// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@fhenixprotocol/cofhe-contracts/FHE.sol";

contract AIWorkspaceGateway is Ownable {
    constructor(uint128 _pricePerCredit, address _backendSigner) Ownable(msg.sender) {
        pricePerCredit = FHE.asEuint128(_pricePerCredit);
        backendSigner = _backendSigner;
    }

    enum RequestType {
        CREATE_ACCOUNT,
        RECHARGE
    }

    enum RequestStatus {
        PENDING,
        COMPLETED,
        FAILED
    }

    struct Request {
        euint128 id;
        address user;
        RequestType requestType;
        euint128 creditsRequested;
        euint128 amountPaid;
        RequestStatus status;
        euint128 createdAt;
    }

    euint128 public nextRequestId;

    euint128 public pricePerCredit;

    address public backendSigner;

    mapping(euint128 => Request) public requests;

    mapping(address => euint128[]) public userRequests;

    event AccountCreationRequested(
        euint128 indexed requestId, address indexed user, euint128 creditsRequested, euint128 amountPaid
    );

    event RechargeRequested(
        euint128 indexed requestId, address indexed user, euint128 creditsRequested, euint128 amountPaid
    );

    event RequestCompleted(euint128 indexed requestId);

    event RequestFailed(euint128 indexed requestId, string reason);

    modifier onlyBackend() {
        require(msg.sender == backendSigner, "Not backend");
        _;
    }

    function requestAccountCreation(uint128 creditsRequested) external payable returns (euint128 requestId) {
        euint128 eCreditRequested = FHE.asEuint128(creditsRequested);
        euint128 requiredPayment = FHE.mul(eCreditRequested, pricePerCredit);

        ebool ok = FHE.gte(FHE.asEuint128(msg.value), requiredPayment);
        require(FHE.getDecryptResult(ok) == false, "Insufficient payment");

        requestId = _createRequest(RequestType.CREATE_ACCOUNT, eCreditRequested);

        emit AccountCreationRequested(requestId, msg.sender, eCreditRequested, FHE.asEuint128(msg.value));
    }

    function requestRecharge(uint128 creditsRequested) external payable returns (euint128 requestId) {
        euint128 eCreditRequested = FHE.asEuint128(creditsRequested);
        euint128 requiredPayment = FHE.mul(eCreditRequested, pricePerCredit);

        ebool ok = FHE.gte(FHE.asEuint128(msg.value), requiredPayment);
        require(FHE.getDecryptResult(ok) == false, "Insufficient payment");

        requestId = _createRequest(RequestType.RECHARGE, eCreditRequested);

        emit RechargeRequested(requestId, msg.sender, eCreditRequested, FHE.asEuint128(msg.value));
    }

    function _createRequest(RequestType requestType, euint128 creditsRequested) internal returns (euint128 requestId) {
        nextRequestId = FHE.add(nextRequestId, FHE.asEuint128(1));
        requestId = nextRequestId;

        requests[requestId] = Request({
            id: requestId,
            user: msg.sender,
            requestType: requestType,
            creditsRequested: creditsRequested,
            amountPaid: FHE.asEuint128(msg.value),
            status: RequestStatus.PENDING,
            createdAt: FHE.asEuint128(block.timestamp)
        });

        userRequests[msg.sender].push(requestId);
    }

    function markCompleted(euint128 requestId) external onlyBackend {
        requests[requestId].status = RequestStatus.COMPLETED;

        emit RequestCompleted(requestId);
    }

    function markFailed(euint128 requestId, string calldata reason) external onlyBackend {
        requests[requestId].status = RequestStatus.FAILED;

        emit RequestFailed(requestId, reason);
    }

    function setBackendSigner(address newBackend) external onlyOwner {
        backendSigner = newBackend;
    }

    function setPricePerCredit(euint128 newPrice) external onlyOwner {
        pricePerCredit = newPrice;
    }

    function getUserRequests(address user) external view returns (euint128[] memory) {
        return userRequests[user];
    }
}
