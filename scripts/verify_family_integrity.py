from build_data import generate,APP
assert (APP/'dist/data.js').read_bytes()==generate(), 'Bundle differs from reviewed inputs'
print('Data source integrity passed. Run npm test for grouping and behavior.')
