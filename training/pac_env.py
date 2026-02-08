"""
Pokemon Auto Chess Gymnasium Environment

Wraps the TypeScript training server HTTP API as a standard Gymnasium
environment for use with stable-baselines3 PPO.

Usage:
    env = PokemonAutoChessEnv(server_url="http://localhost:9100")
    obs, info = env.reset()
    obs, reward, terminated, truncated, info = env.step(action)
"""

import gymnasium as gym
import numpy as np
import requests
from gymnasium import spaces


class PokemonAutoChessEnv(gym.Env):
    """
    Gymnasium environment for Pokemon Auto Chess step-mode training.

    Observation space: Box(low=0, high=1, shape=(obs_size,))
    Action space: Discrete(num_actions)

    The agent acts during PICK phases only. Each step is one micro-action
    (buy, sell, reroll, level up, or end turn). When END_TURN is chosen,
    the fight phase runs instantly and the environment advances to the
    next pick phase.
    """

    metadata = {"render_modes": []}

    def __init__(self, server_url: str = "http://localhost:9100", use_action_mask: bool = True):
        super().__init__()
        self.server_url = server_url.rstrip("/")
        self.use_action_mask = use_action_mask

        # Query server for space dimensions
        try:
            action_info = requests.get(f"{self.server_url}/action-space").json()
            obs_info = requests.get(f"{self.server_url}/observation-space").json()
        except requests.exceptions.ConnectionError:
            raise ConnectionError(
                f"Could not connect to training server at {self.server_url}. "
                "Make sure the TypeScript server is running: npx ts-node app/training/index.ts"
            )

        self.num_actions = action_info["n"]
        self.obs_size = obs_info["n"]

        self.action_space = spaces.Discrete(self.num_actions)
        self.observation_space = spaces.Box(
            low=-1.0, high=2.0, shape=(self.obs_size,), dtype=np.float32
        )

        self._current_action_mask = np.ones(self.num_actions, dtype=np.int8)

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        response = requests.post(f"{self.server_url}/reset").json()
        obs = np.array(response["observation"], dtype=np.float32)
        info = response.get("info", {})
        self._current_action_mask = np.array(
            info.get("actionMask", np.ones(self.num_actions)),
            dtype=np.int8
        )
        info["action_mask"] = self._current_action_mask
        return obs, info

    def step(self, action):
        action = int(action)
        response = requests.post(
            f"{self.server_url}/step",
            json={"action": action}
        ).json()

        obs = np.array(response["observation"], dtype=np.float32)
        reward = float(response["reward"])
        terminated = bool(response["done"])
        truncated = False
        info = response.get("info", {})

        self._current_action_mask = np.array(
            info.get("actionMask", np.ones(self.num_actions)),
            dtype=np.int8
        )
        info["action_mask"] = self._current_action_mask

        return obs, reward, terminated, truncated, info

    def action_masks(self) -> np.ndarray:
        """Return current action mask for masked PPO."""
        return self._current_action_mask

    def close(self):
        pass
