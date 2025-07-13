from utils.deepseek import DeepseekAgent
import sys

def main():
    agent = DeepseekAgent()
    
    print("Deepseek Code Assistant\n" + "="*30)
    try:
        while True:
            print("\nPaste your code (Ctrl+D or Ctrl+Z to submit):")
            code_lines = []
            while True:
                try:
                    line = input()
                    code_lines.append(line)
                except EOFError:
                    break
            
            if not code_lines:
                break
                
            code_snippet = "\n".join(code_lines)
            context = input("Additional context: ")
            
            print("\nAnalyzing...\n")
            response = agent.get_code_review(code_snippet, context)
            print(f"\nDeepseek Suggestions:\n{response}")
    except KeyboardInterrupt:
        print("\nExiting...")
        sys.exit(0)

if __name__ == "__main__":
    main()
