# pylint: skip-file
from datetime import datetime
from typing import Any, Dict, Optional

from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, before_kickoff, crew, task


@CrewBase
class RoadSeek:

    agents_config: str = "config/agents.yaml"
    tasks_config: str = "config/tasks.yaml"

    def __init__(self, llm: Optional[LLM] = None):
        self.llm = llm

    @agent
    def traffic_summarizer(self) -> Agent:
        return Agent(config=self.agents_config["traffic_summarizer"], llm=self.llm)

    @agent
    def traffic_planner(self) -> Agent:
        return Agent(config=self.agents_config["traffic_planner"], llm=self.llm)

    @task
    def summary_task(self) -> Task:
        return Task(config=self.tasks_config["summary_task"], output_file="summary.md")

    @task
    def planning_task(self) -> Task:
        return Task(config=self.tasks_config["planning_task"], output_file="plan.md")

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )
