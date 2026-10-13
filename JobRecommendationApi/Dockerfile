FROM mcr.microsoft.com/dotnet/aspnet:8.0 as base 
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 as build
WORKDIR /src
COPY ["JobRecommendationApi.csproj", "./"]
RUN dotnet restore "JobRecommendation.csproj"
COPY . . 
RUN dotnet build "JobRecommendationApi.csproj" -c Release -o /app/build

FROM build as publish
RUN dotnet publish "JobRecommendationApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "JobRecommendationApi.dll"]