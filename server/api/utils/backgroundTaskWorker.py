import asyncio


class BackgroundTaskWorker:

    """docs:
        - https://docs.python.org/3/library/asyncio-eventloop.html#
        - https://pymotw.com/3/asyncio/
        - https://medium.freecodecamp.org/a-guide-to-asynchronous-
          programming-in-python-with-asyncio-232e2afa44f6
        - https://youtu.be/btCvFt_JsEo
        - https://medium.com/@gauravbaliyan/a-good-use-of-asyncio-
          in-python-and-django-8aa7bc401e5f
        - https://snarky.ca/how-the-heck-does-async-await-work-in-python-3-5/
        - https://blenderartists.org/t/running-background-jobs-
          with-asyncio/673805
        - https://stackoverflow.com/questions/46727787/
          runtimeerror-there-is-no-current-event-loop-in-thread-in-async-apscheduler
    """

    @classmethod
    def start_work(cls, asyn_function, args):
        """This function helps to run an unpredictable function in the background.

        it uses an event loop as central executor.

        :param asyn_function: An asyn function that acts as coroutine.
        :param args: The async function args or params.
                     it should be a tuple of args.
        :return: None
        """
        event_loop = asyncio.new_event_loop()
        asyncio.set_event_loop(event_loop)
        event_loop.run_in_executor(None, cls.run_task, asyn_function, args)

    @classmethod
    def run_task(cls, asyn_function, args):
        """This function creates a future task which runs in background
        until completion

        :param asyn_function: An asyn function that acts as coroutine
        :param args: The async function args or params
        :return: None
        """
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        task = asyncio.ensure_future(asyn_function(*args))

        loop.run_until_complete(task)
        loop.close()
