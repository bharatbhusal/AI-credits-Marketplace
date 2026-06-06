// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AIWorkspaceGateway is Ownable {
    constructor(uint256 _pricePerCredit, address _backendSigner) Ownable(msg.sender) {
        pricePerCredit = _pricePerCredit;
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
        uint256 id;
        address user;
        RequestType requestType;
        uint256 creditsRequested;
        uint256 amountPaid;
        RequestStatus status;
        uint256 createdAt;
    }

    uint256 public nextRequestId;

    uint256 public pricePerCredit;

    address public backendSigner;

    mapping(uint256 => Request) public requests;

    mapping(address => uint256[]) public userRequests;

    event AccountCreationRequested(
        uint256 indexed requestId, address indexed user, uint256 creditsRequested, uint256 amountPaid
    );

    event RechargeRequested(
        uint256 indexed requestId, address indexed user, uint256 creditsRequested, uint256 amountPaid
    );

    event RequestCompleted(uint256 indexed requestId);

    event RequestFailed(uint256 indexed requestId, string reason);

    modifier onlyBackend() {
        require(msg.sender == backendSigner, "Not backend");
        _;
    }

    function requestAccountCreation(uint256 creditsRequested) external payable returns (uint256 requestId) {
        uint256 requiredPayment = creditsRequested * pricePerCredit;

        require(msg.value >= requiredPayment, "Insufficient payment");

        requestId = _createRequest(RequestType.CREATE_ACCOUNT, creditsRequested);

        emit AccountCreationRequested(requestId, msg.sender, creditsRequested, msg.value);
    }

    function requestRecharge(uint256 creditsRequested) external payable returns (uint256 requestId) {
        uint256 requiredPayment = creditsRequested * pricePerCredit;

        require(msg.value >= requiredPayment, "Insufficient payment");

        requestId = _createRequest(RequestType.RECHARGE, creditsRequested);

        emit RechargeRequested(requestId, msg.sender, creditsRequested, msg.value);
    }

    function _createRequest(RequestType requestType, uint256 creditsRequested) internal returns (uint256 requestId) {
        requestId = nextRequestId++;

        requests[requestId] = Request({
            id: requestId,
            user: msg.sender,
            requestType: requestType,
            creditsRequested: creditsRequested,
            amountPaid: msg.value,
            status: RequestStatus.PENDING,
            createdAt: block.timestamp
        });

        userRequests[msg.sender].push(requestId);
    }

    function markCompleted(uint256 requestId) external onlyBackend {
        requests[requestId].status = RequestStatus.COMPLETED;

        emit RequestCompleted(requestId);
    }

    function markFailed(uint256 requestId, string calldata reason) external onlyBackend {
        requests[requestId].status = RequestStatus.FAILED;

        emit RequestFailed(requestId, reason);
    }

    function setBackendSigner(address newBackend) external onlyOwner {
        backendSigner = newBackend;
    }

    function setPricePerCredit(uint256 newPrice) external onlyOwner {
        pricePerCredit = newPrice;
    }

    function withdraw(address payable treasury) external onlyOwner {
        uint256 amount = address(this).balance;

        (bool success,) = treasury.call{value: amount}("");

        require(success, "Transfer failed");
    }

    function getUserRequests(address user) external view returns (uint256[] memory) {
        return userRequests[user];
    }
}
