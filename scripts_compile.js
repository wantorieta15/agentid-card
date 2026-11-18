const solc = require('solc');
const fs = require('fs');
const src = fs.readFileSync('contracts/AgentDirectory.sol', 'utf8');
const input = {
  language: 'Solidity',
  sources: { 'AgentDirectory.sol': { content: src } },
  settings: {
    optimizer: { enabled: false },
    outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object', 'evm.deployedBytecode.object'] } },
  },
};
const out = JSON.parse(solc.compile(JSON.stringify(input)));
const errs = (out.errors || []).filter(e => e.severity === 'error');
const warns = (out.errors || []).filter(e => e.severity === 'warning');
console.log('solc version:', solc.version());
console.log('errors:', errs.length, 'warnings:', warns.length);
errs.forEach(e => console.log('ERROR:', e.formattedMessage));
warns.forEach(e => console.log('WARN:', e.formattedMessage));
if (errs.length) process.exit(1);
const c = out.contracts['AgentDirectory.sol']['AgentDirectory'];
fs.mkdirSync('build', { recursive: true });
fs.writeFileSync('build/AgentDirectory.abi.json', JSON.stringify(c.abi, null, 2));
fs.writeFileSync('build/AgentDirectory.bytecode.txt', '0x' + c.evm.bytecode.object);
fs.writeFileSync('build/AgentDirectory.deployedBytecode.txt', '0x' + c.evm.deployedBytecode.object);
console.log('bytecode bytes:', c.evm.bytecode.object.length / 2);
console.log('deployed bytes:', c.evm.deployedBytecode.object.length / 2);
console.log('ABI functions:', c.abi.filter(x => x.type === 'function').map(f => f.name).join(', '));
