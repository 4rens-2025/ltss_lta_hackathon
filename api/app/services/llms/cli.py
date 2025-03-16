import click
from crewai import LLM

from app.services.llms.roadSeek import RoadSeek


@click.command()
@click.option(
    "--data", prompt="Input data", help="The data to be processed by the agent."
)
def main(data):
    road_seek = RoadSeek(
        llm=LLM(
            model="deepseek/deepseek-chat",
            api_key="",
        )
    )
    road_seek.crew().kickoff(inputs={"data": data})


if __name__ == "__main__":
    main()
