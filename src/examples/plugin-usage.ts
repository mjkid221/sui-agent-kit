import { SuiAgentKit } from "@/agent/sui";
import { getDefaultPlugins, registerPlugins } from "@/plugins";
import { SuiKeypairWallet } from "@/lib/utils/keypairs/SuiKeypairWallet";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { getFullnodeUrl } from "@mysten/sui/client";

// Example of initializing the SuiAgentKit with plugins
async function initializeAgentWithPlugins() {
  // Create wallet from private key
  const privateKey = "your_private_key_here"; // Replace with actual private key
  const wallet = new SuiKeypairWallet(
    Ed25519Keypair.fromSecretKey(privateKey),
    {
      rpcUrl: getFullnodeUrl("testnet"),
      isSponsored: false,
    },
  );

  // Initialize the agent
  const agent = new SuiAgentKit(wallet, {
    rpc: {
      url: getFullnodeUrl("testnet"),
      network: "testnet",
    },
  });

  // Register default plugins
  await registerPlugins(agent, getDefaultPlugins());

  // Using the actions from the plugins
  // Get wallet address using the action from the NativeTokenPlugin
  const walletResponse = await agent.executeAction("AGENT_WALLET_ACTION");
  console.log("Wallet address:", walletResponse.walletAddress);

  // Check token balance
  const balanceResponse = await agent.executeAction("TOKEN_BALANCE_ACTION", {
    // No parameters means get SUI balance of the agent wallet
  });
  console.log("SUI Balance:", balanceResponse.balance);

  return agent;
}

// Creating a custom plugin
async function createAndRegisterCustomPlugin(agent: SuiAgentKit) {
  // This is just an example of how you would create and register a custom plugin
  // You would need to create your own plugin class first

  /*
  // Import a custom plugin
  const { CustomPlugin } = await import("./your-custom-plugin");
  
  // Create an instance of your custom plugin
  const customPlugin = new CustomPlugin();
  
  // Register your custom plugin
  await agent.registerPlugin(customPlugin);
  
  // Use an action from your custom plugin
  const result = await agent.executeAction("YOUR_CUSTOM_ACTION", {
    // Action parameters here
  });
  
  console.log("Custom action result:", result);
  */

  console.log("This is where you would register and use a custom plugin");
}

// Run the example
(async () => {
  try {
    const agent = await initializeAgentWithPlugins();
    await createAndRegisterCustomPlugin(agent);

    console.log("All plugins:", Array.from(agent.plugins.keys()));
    console.log("All actions:", Array.from(agent.actions.keys()));
  } catch (error) {
    console.error("Error:", error);
  }
})();
