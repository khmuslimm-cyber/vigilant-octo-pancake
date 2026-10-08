import json
import urllib.request
import urllib.error

file_id = 'kCBVvWqGtvMfCebnBOAPrG'
node_id = '3330:166' # converted from 3330-166

# Read token
with open(r'C:\Users\gisch\.gemini\config\mcp_config.json', 'r') as f:
    config = json.load(f)
token = config['mcpServers']['figma']['env']['FIGMA_ACCESS_TOKEN']

url = f"https://api.figma.com/v1/files/{file_id}/nodes?ids={node_id}"

req = urllib.request.Request(url, headers={'X-Figma-Token': token})

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
        
        node_info = data.get('nodes', {}).get(node_id, {})
        if node_info:
            document = node_info.get('document', {})
            print(f"Node Name: {document.get('name')}")
            print(f"Node Type: {document.get('type')}")
            
            # Print immediate children names
            children = document.get('children', [])
            print(f"Number of children: {len(children)}")
            for child in children:
                print(f" - {child.get('type')}: {child.get('name')}")
        else:
            print("Node not found or no access.")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code} {e.reason}")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
