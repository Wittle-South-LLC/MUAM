from setuptools import setup, find_packages

with open('README.md') as f:
    long_description = f.read()

setup(name='muam',
      version='0.6.6',
      description='User and group management appliction',
      url='https://github.com/Wittle-South-LLC/MUAM',
      author='Wittle South Ventures, LLC',
      author_email='eric@wittlesouth.com',
      classifiers= ['License :: OSI Approved :: MIT License', 'Intended Audience :: Developers', 'Topic :: Software Development :: Libraries'],
      packages=['muam', 'muam/cli'],
      include_package_data=True,
      data_files=[('spec', ['src/spec/muam.yaml'])],
      install_requires=[
          'coverage',
          'nose',
          'PyYAML',
          'smoacks'
          ],
      entry_points={
          'console_scripts': [
              'us_add_group=muam.cli.add_group:add',
              'us_import_group=muam.cli.imp_group:import_csv',
              'us_search_group=muam.cli.search_group:search',
              'us_add_membership=muam.cli.add_membership:add',
              'us_import_membership=muam.cli.imp_membership:import_csv',
              'us_add_user=muam.cli.add_user:add',
              'us_import_user=muam.cli.imp_user:import_csv',
              'us_search_user=muam.cli.search_user:search',
              
          ]
      },
      long_description=long_description,
      long_description_content_type='text/markdown',
      zip_safe=False)