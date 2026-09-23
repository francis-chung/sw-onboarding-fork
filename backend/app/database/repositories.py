from typing import Any
from uuid import UUID

from sqlalchemy import desc
from sqlmodel import select

from app.database.abstract_repository import AbstractRepository
from app.database.engine import get_db_session
from app.database.models import Command, CommandHistory, MainCommand


class MainCommandRepository(AbstractRepository[MainCommand, int]):
    """
    Repository for MainCommand table.
    """

    model = MainCommand


class CommandsRepository(AbstractRepository[Command, UUID]):
    """
    Repository for Command table.
    """

    model = Command

    async def update(self, obj_id: UUID, data: dict[str, Any]) -> Command:
        """
        Overrides updates for commands to ensure the type_ argument is valid.

        :param obj_id: UUID of the command to update.
        :param data: Data to update the corresponding command to.
        :return: The updated command.
        """
        if "type_" in data:
            main_cmd_repo = MainCommandRepository()
            try:
                await main_cmd_repo.get_by_id(data["type_"])
            except ValueError as e:
                raise RuntimeError(f"Main commaand with ID {data['type_']} not found") from e
        return await super().update(obj_id, data)


class CommandHistoryRepository(AbstractRepository[CommandHistory, UUID]):
    """
    Repository for Command table.
    """

    model = CommandHistory

    async def get_history_by_id(self, command_id: UUID) -> list[CommandHistory]:
        """
        Get the entire history of a command by its UUID, sorted by latest first.
        """
        async with get_db_session() as session:
            result = await session.exec(
                select(self.model).where(self.model.command_id == command_id).order_by(desc("created_at"))
            )
            return list(result.all())
