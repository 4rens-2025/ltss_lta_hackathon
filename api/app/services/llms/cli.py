import click
from crewai import LLM

from app.services.llms.roadSeek import RoadSeek
from dotenv import load_dotenv

load_dotenv()

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")


@click.command()
@click.option("--data", prompt="Input data", help="The data to be processed by the agent.")
def main(data):
    road_seek = RoadSeek(
        llm=LLM(
            model="deepseek/deepseek-chat",
            api_key=DEEPSEEK_API_KEY,
        )
    )
    road_seek.crew().kickoff(inputs={"data": data})


if __name__ == "__main__":
    main()
