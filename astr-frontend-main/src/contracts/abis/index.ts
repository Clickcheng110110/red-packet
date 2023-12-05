export const masterChefAbi = [
  'function deposit(uint256 pid, uint256 amount) external payable',
  'function depositWithPermit(uint256 pid, uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external',
  'function withdraw(uint256 pid, uint256 amount) external',
  'function claim(uint256 pid)',
  'function batchClaim(uint256[] calldata pids)',
  'function pendingReward(uint256 pid, address _user) external view returns (uint256)',
  'function userInfo(uint256 pid,address user) external view returns(uint256 amount,uint256 index)',
];
export const erc20Abi = [
  'function name() public view virtual override returns (string memory) ',
  'function symbol() public view virtual override returns (string memory)',
  'function decimals() public view virtual override returns (uint8)',
  'function totalSupply() public view virtual override returns (uint256)',
  'function nonces(address account) public view virtual override returns (uint256)',
  'function balanceOf(address account) public view virtual override returns (uint256)',
  'function transfer(address to, uint256 amount) public virtual override returns (bool)',
  'function allowance(address owner, address spender) public view virtual override returns (uint256)',
  'function approve(address spender, uint256 amount) public virtual override returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool)',
  'function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool)',
  'function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool)',
];

export const esZTHAbi = [
  'function swap(uint256 amount, uint256 lockTimes) external',
  'function redeem(uint256 lockId) public',
  'function batchRedeem(uint256[] calldata lockIds) external',
  'function getAmountOut(uint256 amount, uint256 lockTimes) public pure returns (uint256)',
];

export const IPOAbi = [
  'function buy() external payable',
  'function started() view returns(bool)',
  'function totalSold() view returns(uint256)',
  'function volume() view returns(uint256)',
  'function getETHPrice() view returns(uint256)',
];

export const IVotingEscrowAbi = [
  'function createLock(uint256 _value, uint256 _unlockTime) external',
  'function createLockWithPermit(uint256 _value, uint256 _unlockTime, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external',
  'function increaseAmount(uint256 _value) external',
  'function increaseUnlockTime(uint256 _unlockTime) external',
  'function withdraw() external',
  'function quitLock() external',
  'function balanceOf(address _owner) external view returns (uint256)',
  'function totalSupply() external view returns (uint256)',
  'function locked(address account) external returns(uint128 amount, uint64 end, uint64 start)',
];
