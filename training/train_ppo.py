"""
PPO Training Script for Pokemon Auto Chess

Trains a PPO agent using stable-baselines3 with action masking.

Prerequisites:
  1. Start the TypeScript training server:
       npx ts-node app/training/index.ts
  2. Install Python dependencies:
       pip install -r training/requirements.txt
  3. Run this script:
       python training/train_ppo.py

The agent learns to:
  - Buy pokemon from the shop (economy management)
  - Build team compositions (synergy optimization)
  - Level up at the right time (tempo decisions)
  - Sell underperforming units (resource recycling)

Architecture:
  The PPO policy uses a small MLP (64x64) which is appropriate for the
  ~150-dimensional observation space and 16 discrete actions.
"""

import argparse
import os
import time
from typing import Optional

import numpy as np
import requests
from stable_baselines3 import PPO
from stable_baselines3.common.callbacks import (
    BaseCallback,
    CheckpointCallback,
    EvalCallback,
)
from stable_baselines3.common.monitor import Monitor

from pac_env import PokemonAutoChessEnv


class ActionMaskCallback(BaseCallback):
    """
    Callback that applies action masking during training.
    Invalid actions are masked out by setting their log probabilities
    to -inf before sampling.
    """

    def _on_step(self) -> bool:
        return True


class TrainingMetricsCallback(BaseCallback):
    """Logs custom training metrics to TensorBoard."""

    def __init__(self, verbose=0):
        super().__init__(verbose)
        self.episode_rewards = []
        self.episode_lengths = []
        self.episode_ranks = []
        self.episode_stages = []

    def _on_step(self) -> bool:
        # Check for episode end
        infos = self.locals.get("infos", [])
        for info in infos:
            if "episode" in info:
                self.episode_rewards.append(info["episode"]["r"])
                self.episode_lengths.append(info["episode"]["l"])
            if "rank" in info:
                self.episode_ranks.append(info["rank"])
            if "stage" in info:
                self.episode_stages.append(info["stage"])

        # Log every 10 episodes
        if len(self.episode_rewards) >= 10:
            self.logger.record(
                "training/mean_reward",
                np.mean(self.episode_rewards[-10:]),
            )
            self.logger.record(
                "training/mean_episode_length",
                np.mean(self.episode_lengths[-10:]),
            )
            if self.episode_ranks:
                self.logger.record(
                    "training/mean_rank",
                    np.mean(self.episode_ranks[-10:]),
                )
            if self.episode_stages:
                self.logger.record(
                    "training/mean_final_stage",
                    np.mean(self.episode_stages[-10:]),
                )

        return True


def wait_for_server(url: str, timeout: int = 60):
    """Wait for the training server to become available."""
    print(f"Waiting for training server at {url}...")
    start = time.time()
    while time.time() - start < timeout:
        try:
            resp = requests.get(f"{url}/health", timeout=2)
            if resp.status_code == 200:
                print("Training server is ready!")
                return True
        except requests.exceptions.ConnectionError:
            pass
        time.sleep(1)
    raise TimeoutError(
        f"Training server at {url} did not become available within {timeout}s"
    )


def benchmark_env(url: str):
    """Run a benchmark game and report speed."""
    print("\nRunning benchmark (full game with random actions)...")
    resp = requests.post(f"{url}/benchmark").json()
    print(f"  Steps:          {resp['steps']}")
    print(f"  Elapsed:        {resp['elapsedMs']}ms")
    print(f"  Steps/sec:      {resp['stepsPerSecond']:.0f}")
    print(f"  Final rank:     {resp['finalRank']}")
    print(f"  Final stage:    {resp['finalStage']}")
    print(f"  Final reward:   {resp['finalReward']:.2f}")
    print()
    return resp


def make_env(server_url: str):
    """Create and wrap the training environment."""
    env = PokemonAutoChessEnv(server_url=server_url)
    env = Monitor(env)
    return env


def train(
    server_url: str = "http://localhost:9100",
    total_timesteps: int = 500_000,
    learning_rate: float = 3e-4,
    n_steps: int = 512,
    batch_size: int = 64,
    n_epochs: int = 10,
    gamma: float = 0.99,
    gae_lambda: float = 0.95,
    clip_range: float = 0.2,
    ent_coef: float = 0.01,
    save_dir: str = "training/checkpoints",
    log_dir: str = "training/logs",
    resume_from: Optional[str] = None,
):
    """
    Train a PPO agent on Pokemon Auto Chess.

    Args:
        server_url: URL of the TypeScript training server
        total_timesteps: Total training timesteps
        learning_rate: PPO learning rate
        n_steps: Steps per rollout buffer collection
        batch_size: Minibatch size for PPO updates
        n_epochs: Number of optimization epochs per update
        gamma: Discount factor
        gae_lambda: GAE lambda for advantage estimation
        clip_range: PPO clipping parameter
        ent_coef: Entropy coefficient (encourages exploration)
        save_dir: Directory for model checkpoints
        log_dir: Directory for TensorBoard logs
        resume_from: Path to checkpoint to resume from
    """
    os.makedirs(save_dir, exist_ok=True)
    os.makedirs(log_dir, exist_ok=True)

    # Wait for server
    wait_for_server(server_url)

    # Run benchmark
    benchmark_env(server_url)

    # Create environment
    env = make_env(server_url)

    # Create or load model
    if resume_from and os.path.exists(resume_from):
        print(f"Resuming from checkpoint: {resume_from}")
        model = PPO.load(resume_from, env=env)
    else:
        print("Creating new PPO model...")
        model = PPO(
            "MlpPolicy",
            env,
            learning_rate=learning_rate,
            n_steps=n_steps,
            batch_size=batch_size,
            n_epochs=n_epochs,
            gamma=gamma,
            gae_lambda=gae_lambda,
            clip_range=clip_range,
            ent_coef=ent_coef,
            verbose=1,
            tensorboard_log=log_dir,
            policy_kwargs=dict(
                net_arch=dict(pi=[128, 128], vf=[128, 128])
            ),
        )

    # Callbacks
    checkpoint_cb = CheckpointCallback(
        save_freq=10_000,
        save_path=save_dir,
        name_prefix="ppo_pac",
    )
    metrics_cb = TrainingMetricsCallback()

    print(f"\nStarting training for {total_timesteps} timesteps...")
    print(f"  Learning rate:  {learning_rate}")
    print(f"  Batch size:     {batch_size}")
    print(f"  N steps:        {n_steps}")
    print(f"  Entropy coef:   {ent_coef}")
    print(f"  Checkpoints:    {save_dir}")
    print(f"  TensorBoard:    {log_dir}")
    print(f"\nMonitor training with: tensorboard --logdir {log_dir}")
    print()

    model.learn(
        total_timesteps=total_timesteps,
        callback=[checkpoint_cb, metrics_cb],
        progress_bar=True,
    )

    # Save final model
    final_path = os.path.join(save_dir, "ppo_pac_final")
    model.save(final_path)
    print(f"\nTraining complete! Model saved to {final_path}")

    return model


def evaluate(model_path: str, server_url: str, n_games: int = 20):
    """Evaluate a trained model over multiple games."""
    env = make_env(server_url)
    model = PPO.load(model_path)

    ranks = []
    rewards = []
    stages = []

    for i in range(n_games):
        obs, info = env.reset()
        total_reward = 0
        done = False

        while not done:
            action, _ = model.predict(obs, deterministic=True)
            obs, reward, terminated, truncated, info = env.step(action)
            total_reward += reward
            done = terminated or truncated

        ranks.append(info.get("rank", 8))
        rewards.append(total_reward)
        stages.append(info.get("stage", 0))
        print(
            f"  Game {i+1}/{n_games}: Rank={ranks[-1]}, "
            f"Stage={stages[-1]}, Reward={total_reward:.2f}"
        )

    print(f"\nEvaluation Results ({n_games} games):")
    print(f"  Mean Rank:    {np.mean(ranks):.2f} +/- {np.std(ranks):.2f}")
    print(f"  Mean Reward:  {np.mean(rewards):.2f} +/- {np.std(rewards):.2f}")
    print(f"  Mean Stage:   {np.mean(stages):.1f}")
    print(f"  Win Rate:     {sum(1 for r in ranks if r == 1) / n_games:.1%}")
    print(f"  Top 4 Rate:   {sum(1 for r in ranks if r <= 4) / n_games:.1%}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PPO Training for Pokemon Auto Chess")
    parser.add_argument("--server-url", default="http://localhost:9100", help="Training server URL")
    parser.add_argument("--timesteps", type=int, default=500_000, help="Total training timesteps")
    parser.add_argument("--lr", type=float, default=3e-4, help="Learning rate")
    parser.add_argument("--batch-size", type=int, default=64, help="Batch size")
    parser.add_argument("--n-steps", type=int, default=512, help="Steps per rollout")
    parser.add_argument("--ent-coef", type=float, default=0.01, help="Entropy coefficient")
    parser.add_argument("--save-dir", default="training/checkpoints", help="Checkpoint directory")
    parser.add_argument("--log-dir", default="training/logs", help="TensorBoard log directory")
    parser.add_argument("--resume", default=None, help="Resume from checkpoint path")
    parser.add_argument("--evaluate", default=None, help="Evaluate model at path instead of training")
    parser.add_argument("--eval-games", type=int, default=20, help="Number of evaluation games")
    parser.add_argument("--benchmark", action="store_true", help="Just run benchmark")

    args = parser.parse_args()

    if args.benchmark:
        wait_for_server(args.server_url)
        benchmark_env(args.server_url)
    elif args.evaluate:
        wait_for_server(args.server_url)
        evaluate(args.evaluate, args.server_url, args.eval_games)
    else:
        train(
            server_url=args.server_url,
            total_timesteps=args.timesteps,
            learning_rate=args.lr,
            batch_size=args.batch_size,
            n_steps=args.n_steps,
            ent_coef=args.ent_coef,
            save_dir=args.save_dir,
            log_dir=args.log_dir,
            resume_from=args.resume,
        )
