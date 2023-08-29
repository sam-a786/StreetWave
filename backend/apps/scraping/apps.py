from django.apps import AppConfig

# Used this guide for scheduling
# https://medium.com/@kevin.michael.horan/scheduling-tasks-in-django-with-the-advanced-python-scheduler-663f17e868e6
class ScrapingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.scraping'

    def ready(self):
        from .updater import ContractUpdater
        updater = ContractUpdater()
        updater.start()
